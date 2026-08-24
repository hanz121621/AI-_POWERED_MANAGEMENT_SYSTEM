import { useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
} from "lucide-react";

import api from "@/services/api";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ============================================================
// RESET PASSWORD
// ============================================================

function ResetPassword() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // Token received from:
    // /reset-password?token=...
    const token = searchParams.get("token");

    // ========================================================
    // FORM STATE
    // ========================================================

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    // ========================================================
    // UI STATE
    // ========================================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // ========================================================
    // PASSWORD VALIDATION
    // ========================================================

    const validatePassword = (value) => {
        if (value.length < 8) {
            return "Password must be at least 8 characters.";
        }

        if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(value)) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(value)) {
            return "Password must contain at least one number.";
        }

        if (!/[^A-Za-z0-9]/.test(value)) {
            return "Password must contain at least one special character.";
        }

        return "";
    };

    // ========================================================
    // HANDLE SUBMIT
    // ========================================================

    async function handleSubmit(e) {
        e.preventDefault();

        // Clear previous messages
        setError("");
        setSuccess("");

        // ====================================================
        // CHECK TOKEN
        // ====================================================

        if (!token) {
            setError(
                "This password reset link is invalid or has expired."
            );

            return;
        }

        // ====================================================
        // CHECK PASSWORD
        // ====================================================

        if (!password.trim()) {
            setError("Please enter your new password.");
            return;
        }

        // ====================================================
        // PASSWORD SECURITY VALIDATION
        // ====================================================

        const passwordError =
            validatePassword(password);

        if (passwordError) {
            setError(passwordError);
            return;
        }

        // ====================================================
        // CONFIRM PASSWORD
        // ====================================================

        if (!confirmPassword.trim()) {
            setError(
                "Please confirm your new password."
            );

            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // ====================================================
        // START LOADING
        // ====================================================

        setLoading(true);

        try {
            // =================================================
            // CALL BACKEND RESET PASSWORD API
            // =================================================
            //
            // IMPORTANT:
            // This is NOT /Auth/login.
            //
            // The backend should expose a reset-password
            // endpoint that accepts the reset token and
            // the new password.
            //
            // =================================================

            const response = await api.post(
                "/Auth/reset-password",
                {
                    token,
                    password,
                    confirmPassword,
                }
            );

            const data = response.data;

            console.log(
                "RESET PASSWORD RESPONSE:",
                data
            );

            // =================================================
            // HANDLE BACKEND FAILURE
            // =================================================

            if (!data) {
                setError(
                    "Unable to reset your password. Please try again."
                );

                return;
            }

            if (data.success === false) {
                setError(
                    data.message ||
                        data.Message ||
                        "Unable to reset your password."
                );

                return;
            }

            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                data.message ||
                    data.Message ||
                    "Your password has been reset successfully."
            );

            // Clear password fields
            setPassword("");
            setConfirmPassword("");

            // =================================================
            // REDIRECT TO LOGIN
            // =================================================

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error(
                "RESET PASSWORD ERROR:",
                error
            );

            // =================================================
            // SERVER RESPONSE ERROR
            // =================================================

            if (error.response) {
                const status =
                    error.response.status;

                const responseData =
                    error.response.data;

                // ---------------------------------------------
                // 400 - BAD REQUEST
                // ---------------------------------------------

                if (status === 400) {
                    setError(
                        responseData?.message ||
                            responseData?.Message ||
                            "The reset request is invalid. Please check your password and try again."
                    );

                    return;
                }

                // ---------------------------------------------
                // 401 - INVALID TOKEN
                // ---------------------------------------------

                if (status === 401) {
                    setError(
                        responseData?.message ||
                            responseData?.Message ||
                            "Your password reset link is invalid or has expired."
                    );

                    return;
                }

                // ---------------------------------------------
                // 404 - ENDPOINT / RESOURCE NOT FOUND
                // ---------------------------------------------

                if (status === 404) {
                    setError(
                        responseData?.message ||
                            responseData?.Message ||
                            "Password reset service was not found."
                    );

                    return;
                }

                // ---------------------------------------------
                // 500 - SERVER ERROR
                // ---------------------------------------------

                if (status >= 500) {
                    setError(
                        "A server error occurred. Please try again later."
                    );

                    return;
                }

                // ---------------------------------------------
                // OTHER API ERROR
                // ---------------------------------------------

                setError(
                    responseData?.message ||
                        responseData?.Message ||
                        "Unable to reset your password."
                );

                return;
            }

            // =================================================
            // REQUEST WAS SENT BUT NO RESPONSE
            // =================================================

            if (error.request) {
                setError(
                    "Unable to connect to the AI-PMS server. Please make sure the backend is running."
                );

                return;
            }

            // =================================================
            // UNKNOWN ERROR
            // =================================================

            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                px-4
                bg-gradient-to-br
                from-slate-950
                via-blue-950
                to-indigo-950
            "
        >
            <Card
                className="
                    w-full
                    max-w-md
                    shadow-2xl
                    bg-white/95
                    rounded-2xl
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <CardHeader className="text-center space-y-3">

                    {/* ICON */}

                    <div
                        className="
                            mx-auto
                            w-14
                            h-14
                            rounded-2xl
                            bg-gradient-to-r
                            from-blue-600
                            to-indigo-600
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <Lock
                            className="text-white size-7"
                        />
                    </div>

                    {/* TITLE */}

                    <CardTitle className="text-2xl font-bold">
                        Reset Password
                    </CardTitle>

                    {/* DESCRIPTION */}

                    <CardDescription>
                        Create your new secure password
                    </CardDescription>

                </CardHeader>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <CardContent>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* ==================================================
                            NEW PASSWORD
                        ================================================== */}

                        <div className="space-y-2">

                            <Label htmlFor="password">
                                New Password
                            </Label>

                            <div className="relative">

                                <Lock
                                    className="
                                        absolute
                                        left-3
                                        top-2.5
                                        size-4
                                        text-blue-600
                                    "
                                />

                                <Input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(
                                            e.target.value
                                        );
                                        setError("");
                                    }}
                                    className="
                                        pl-9
                                        pr-10
                                        h-11
                                    "
                                    disabled={loading}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-2.5
                                        text-slate-500
                                        hover:text-blue-600
                                        transition-colors
                                    "
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* ==================================================
                            PASSWORD REQUIREMENTS
                        ================================================== */}

                        <div
                            className="
                                rounded-lg
                                bg-blue-50
                                border
                                border-blue-100
                                p-3
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-medium
                                    text-slate-700
                                    mb-2
                                "
                            >
                                Password must contain:
                            </p>

                            <ul
                                className="
                                    text-xs
                                    text-slate-600
                                    space-y-1
                                "
                            >
                                <li>
                                    • At least 8 characters
                                </li>

                                <li>
                                    • At least one uppercase letter
                                </li>

                                <li>
                                    • At least one lowercase letter
                                </li>

                                <li>
                                    • At least one number
                                </li>

                                <li>
                                    • At least one special character
                                </li>
                            </ul>
                        </div>

                        {/* ==================================================
                            CONFIRM PASSWORD
                        ================================================== */}

                        <div className="space-y-2">

                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>

                            <div className="relative">

                                <Lock
                                    className="
                                        absolute
                                        left-3
                                        top-2.5
                                        size-4
                                        text-blue-600
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
                                    placeholder="Confirm new password"
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(e) => {
                                        setConfirmPassword(
                                            e.target.value
                                        );
                                        setError("");
                                    }}
                                    className="
                                        pl-9
                                        pr-10
                                        h-11
                                    "
                                    disabled={loading}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-2.5
                                        text-slate-500
                                        hover:text-blue-600
                                        transition-colors
                                    "
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* ==================================================
                            ERROR
                        ================================================== */}

                        {error && (
                            <p
                                className="
                                    text-sm
                                    text-red-600
                                    bg-red-50
                                    border
                                    border-red-100
                                    p-3
                                    rounded-lg
                                "
                            >
                                {error}
                            </p>
                        )}

                        {/* ==================================================
                            SUCCESS
                        ================================================== */}

                        {success && (
                            <p
                                className="
                                    text-sm
                                    text-green-600
                                    bg-green-50
                                    border
                                    border-green-100
                                    p-3
                                    rounded-lg
                                "
                            >
                                {success}
                            </p>
                        )}

                        {/* ==================================================
                            SUBMIT BUTTON
                        ================================================== */}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                h-11
                                bg-gradient-to-r
                                from-blue-600
                                to-indigo-600
                                hover:from-blue-700
                                hover:to-indigo-700
                                disabled:opacity-60
                            "
                        >
                            {loading
                                ? "Updating Password..."
                                : "Update Password"}
                        </Button>

                        {/* ==================================================
                            BACK TO LOGIN
                        ================================================== */}

                        <Link
                            to="/login"
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                text-sm
                                text-blue-600
                                hover:text-blue-700
                                hover:underline
                            "
                        >
                            <ArrowLeft size={16} />

                            Back to Login
                        </Link>

                    </form>

                </CardContent>

            </Card>
        </div>
    );
}

export default ResetPassword;