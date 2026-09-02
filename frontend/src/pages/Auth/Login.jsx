
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    ShieldCheck,
    Brain,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";

import ThemeToggle from "@/components/common/ThemeToggle";

import { useAuth } from "@/contexts/useAuth";

import {
    loginUser,
    normalizeRole,
} from "@/services/authService";

function Login() {
    const navigate = useNavigate();

    const { updateUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    // ============================================================
    // HANDLE INPUT
    // ============================================================

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (error) {
            setError("");
        }
    }

    // ============================================================
    // CONTRIBUTOR DASHBOARD
    // ============================================================
    //
    // Backend role:
    //   Admin       = 1
    //   Manager     = 2
    //   Contributor = 3
    //
    // Contributor is the parent role.
    // The actual dashboard is determined by the contributor
    // classification returned by /Users/profile.
    //
    // Supported names:
    //   Team Leader
    //   Staff
    //   Developer
    //
    // We check several normalized field names because the current
    // authService is being aligned with the backend UserDto.
    // ============================================================

    function getContributorDashboard(user) {
        const values = [
            user?.contributorTypeName,
            user?.contributorType,
            user?.contributorSubTypeName,
            user?.contributorSubType,
            user?.contributorTypeDefinitionName,
            user?.developerSpecializationName,
            user?.staffSpecializationName,
        ]
            .filter(Boolean)
            .map((value) =>
                String(value)
                    .trim()
                    .toLowerCase()
            );

        console.log(
            "CONTRIBUTOR CLASSIFICATION VALUES:",
            values
        );

        // ========================================================
        // TEAM LEADER
        // ========================================================

        if (
            values.some((value) =>
                value.includes("team leader") ||
                value.includes("teamleader")
            )
        ) {
            return "/team-leader/dashboard";
        }

        // ========================================================
        // DEVELOPER
        // ========================================================

        if (
            values.some((value) =>
                value === "developer" ||
                value.includes("developer")
            )
        ) {
            return "/developer/dashboard";
        }

        // ========================================================
        // STAFF
        // ========================================================

        if (
            values.some((value) =>
                value === "staff" ||
                value.includes("staff")
            )
        ) {
            return "/staff/dashboard";
        }

        return null;
    }

    // ============================================================
    // LOGIN
    // ============================================================

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        const email = formData.email
            .trim()
            .toLowerCase();

        const password = formData.password;

        if (!email || !password) {
            setError(
                "Email and password are required."
            );

            return;
        }

        try {
            setLoading(true);

            // ====================================================
            // AUTHENTICATION
            // ====================================================
            //
            // loginUser handles:
            // - POST /Auth/login
            // - access token
            // - refresh token
            // - /Users/profile
            // - current user
            // - localStorage
            // ====================================================

            const result = await loginUser(
                email,
                password
            );

            console.log(
                "========== LOGIN RESULT =========="
            );

            console.log(
                "LOGIN RESULT:",
                result
            );

            console.log(
                "=================================="
            );

            if (
                !result ||
                result.success !== true
            ) {
                setError(
                    result?.error ??
                    "Invalid email or password."
                );

                return;
            }

            const user = result.user;

            if (!user) {
                setError(
                    "Login succeeded but user information was not returned."
                );

                return;
            }

            // ====================================================
            // UPDATE AUTH CONTEXT
            // ====================================================
            //
            // IMPORTANT:
            //
            // Do NOT call:
            //
            //     login(user)
            //
            // because AuthProvider.login expects:
            //
            //     login(email, password)
            //
            // loginUser() has already authenticated the user.
            // updateUser() only synchronizes the authenticated
            // user with React AuthContext.
            // ====================================================

            updateUser(user);

            // ====================================================
            // REMEMBER ME
            // ====================================================

            if (rememberMe) {
                localStorage.setItem(
                    "rememberMe",
                    "true"
                );
            } else {
                localStorage.removeItem(
                    "rememberMe"
                );
            }

            // ====================================================
            // NORMALIZE ROLE
            // ====================================================

            const role = normalizeRole(
                user.role
            );

            console.log(
                "LOGIN USER:",
                user
            );

            console.log(
                "LOGIN ROLE:",
                role
            );

            // ====================================================
            // ADMIN
            // ====================================================

            if (role === "Admin") {
                console.log(
                    "REDIRECTING TO ADMIN DASHBOARD"
                );

                navigate(
                    "/admin/dashboard",
                    {
                        replace: true,
                    }
                );

                return;
            }

            // ====================================================
            // MANAGER
            // ====================================================

            if (role === "Manager") {
                console.log(
                    "REDIRECTING TO MANAGER DASHBOARD"
                );

                navigate(
                    "/manager/dashboard",
                    {
                        replace: true,
                    }
                );

                return;
            }

            // ====================================================
            // CONTRIBUTOR
            // ====================================================

            if (role === "Contributor") {
                const dashboard =
                    getContributorDashboard(
                        user
                    );

                console.log(
                    "CONTRIBUTOR DASHBOARD:",
                    dashboard
                );

                if (!dashboard) {
                    setError(
                        "Your Contributor account does not have a valid classification. Please contact an administrator."
                    );

                    return;
                }

                navigate(
                    dashboard,
                    {
                        replace: true,
                    }
                );

                return;
            }

            // ====================================================
            // INVALID ROLE
            // ====================================================

            setError(
                "Your account does not have a valid role."
            );
        } catch (error) {
            console.error(
                "========== LOGIN PAGE ERROR =========="
            );

            console.error(
                "ERROR:",
                error
            );

            console.error(
                "RESPONSE:",
                error?.response?.data
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "======================================"
            );

            setError(
                error?.response?.data?.message ??
                error?.response?.data?.error ??
                error?.message ??
                "Something went wrong while signing in."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-background
                text-foreground
                transition-colors
                duration-500
            "
        >
            {/* BACKGROUND */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-32
                    -top-32
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-blue-500/10
                    blur-[120px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-40
                    -right-40
                    h-[600px]
                    w-[600px]
                    rounded-full
                    bg-cyan-500/10
                    blur-[130px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-[400px]
                    w-[400px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-blue-600/5
                    blur-[100px]
                "
            />

            {/* HEADER */}

            <header
                className="
                    absolute
                    left-0
                    right-0
                    top-0
                    z-30
                    border-b
                    border-border/40
                    bg-background/70
                    backdrop-blur-xl
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-20
                        max-w-[1600px]
                        items-center
                        justify-between
                        px-6
                        sm:px-10
                        lg:px-14
                        xl:px-20
                    "
                >
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="
                            group
                            flex
                            items-center
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-blue-600
                                to-cyan-500
                                text-white
                                shadow-xl
                                shadow-blue-500/20
                                transition-all
                                duration-300
                                group-hover:scale-105
                                group-hover:shadow-blue-500/40
                            "
                        >
                            <Brain size={25} />
                        </div>

                        <div className="text-left">
                            <p
                                className="
                                    text-lg
                                    font-bold
                                    tracking-tight
                                "
                            >
                                Africom
                                <span className="text-blue-500">
                                    {" "}AI-PMS
                                </span>
                            </p>

                            <p
                                className="
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-[0.2em]
                                    text-muted-foreground
                                "
                            >
                                Project Management System
                            </p>
                        </div>
                    </button>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="
                                hidden
                                h-10
                                gap-2
                                px-4
                                sm:inline-flex
                            "
                        >
                            <ArrowLeft size={17} />
                            Back to Home
                        </Button>
                    </div>
                </div>
            </header>

            {/* MAIN */}

            <main
                className="
                    relative
                    z-10
                    flex
                    min-h-screen
                    items-center
                    px-6
                    pb-16
                    pt-28
                    sm:px-10
                    lg:px-14
                    xl:px-20
                "
            >
                <div
                    className="
                        mx-auto
                        grid
                        w-full
                        max-w-[1600px]
                        items-center
                        gap-16
                        xl:grid-cols-[1.15fr_0.85fr]
                        2xl:gap-24
                    "
                >
                    {/* LEFT */}

                    <motion.section
                        initial={{
                            opacity: 0,
                            x: -50,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.7,
                            ease: "easeOut",
                        }}
                        className="
                            hidden
                            xl:block
                        "
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.15,
                            }}
                            className="
                                mb-8
                                inline-flex
                                items-center
                                gap-3
                                rounded-full
                                border
                                border-blue-500/20
                                bg-blue-500/10
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-blue-600
                                dark:text-blue-300
                            "
                        >
                            <span
                                className="
                                    h-2
                                    w-2
                                    animate-pulse
                                    rounded-full
                                    bg-emerald-500
                                "
                            />

                            Secure Africom Internal Platform
                        </motion.div>

                        <h1
                            className="
                                max-w-4xl
                                text-6xl
                                font-black
                                leading-[1.02]
                                tracking-[-0.04em]
                                2xl:text-7xl
                            "
                        >
                            Welcome back to

                            <span
                                className="
                                    mt-3
                                    block
                                    bg-gradient-to-r
                                    from-blue-600
                                    via-blue-500
                                    to-cyan-500
                                    bg-clip-text
                                    text-transparent
                                "
                            >
                                Africom AI-PMS
                            </span>
                        </h1>

                        <p
                            className="
                                mt-8
                                max-w-3xl
                                text-xl
                                leading-9
                                text-muted-foreground
                                2xl:text-2xl
                                2xl:leading-10
                            "
                        >
                            Manage projects, coordinate teams,
                            track tasks, monitor performance,
                            and use intelligent insights to
                            deliver projects more efficiently.
                        </p>

                        <div
                            className="
                                mt-12
                                grid
                                max-w-3xl
                                grid-cols-2
                                gap-x-10
                                gap-y-6
                            "
                        >
                            <LargeTrustItem>
                                Centralized project management
                            </LargeTrustItem>

                            <LargeTrustItem>
                                Intelligent project insights
                            </LargeTrustItem>

                            <LargeTrustItem>
                                Team and task management
                            </LargeTrustItem>

                            <LargeTrustItem>
                                Performance analytics
                            </LargeTrustItem>
                        </div>

                        <div
                            className="
                                mt-14
                                flex
                                items-center
                                gap-4
                                text-sm
                                text-muted-foreground
                            "
                        >
                            <div
                                className="
                                    h-px
                                    w-16
                                    bg-border
                                "
                            />

                            Built for efficient project delivery
                        </div>
                    </motion.section>

                    {/* LOGIN CARD */}

                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 40,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.1,
                            ease: "easeOut",
                        }}
                        className="
                            mx-auto
                            w-full
                            max-w-xl
                        "
                    >
                        <Card
                            className="
                                overflow-hidden
                                rounded-3xl
                                border-border/60
                                bg-card/90
                                shadow-2xl
                                backdrop-blur-2xl
                            "
                        >
                            <div
                                className="
                                    h-1.5
                                    w-full
                                    bg-gradient-to-r
                                    from-blue-600
                                    via-cyan-500
                                    to-blue-600
                                "
                            />

                            <CardHeader
                                className="
                                    space-y-6
                                    px-8
                                    pb-5
                                    pt-10
                                    sm:px-12
                                    sm:pt-12
                                "
                            >
                                <motion.div
                                    initial={{
                                        scale: 0.7,
                                        rotate: -8,
                                    }}
                                    animate={{
                                        scale: 1,
                                        rotate: 0,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.25,
                                    }}
                                    className="
                                        flex
                                        h-20
                                        w-20
                                        items-center
                                        justify-center
                                        rounded-3xl
                                        bg-gradient-to-br
                                        from-blue-600
                                        to-cyan-500
                                        text-white
                                        shadow-2xl
                                        shadow-blue-500/25
                                    "
                                >
                                    <Brain size={38} />
                                </motion.div>

                                <div>
                                    <CardTitle
                                        className="
                                            text-3xl
                                            font-extrabold
                                            tracking-tight
                                            sm:text-4xl
                                        "
                                    >
                                        Sign in
                                    </CardTitle>

                                    <CardDescription
                                        className="
                                            mt-3
                                            text-base
                                            leading-6
                                            sm:text-lg
                                        "
                                    >
                                        Access your Africom AI-PMS
                                        workspace
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent
                                className="
                                    px-8
                                    pb-10
                                    sm:px-12
                                    sm:pb-12
                                "
                            >
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-7"
                                >
                                    {/* EMAIL */}

                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-semibold"
                                        >
                                            Email address
                                        </Label>

                                        <div className="relative">
                                            <Mail
                                                className="
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    z-10
                                                    -translate-y-1/2
                                                    text-blue-500
                                                "
                                                size={20}
                                            />

                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder="Enter your email address"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="
                                                    h-13
                                                    rounded-xl
                                                    pl-12
                                                    text-base
                                                    shadow-sm
                                                    transition-all
                                                    focus-visible:ring-2
                                                    focus-visible:ring-blue-500
                                                "
                                            />
                                        </div>
                                    </div>

                                    {/* PASSWORD */}

                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-semibold"
                                        >
                                            Password
                                        </Label>

                                        <div className="relative">
                                            <Lock
                                                className="
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    z-10
                                                    -translate-y-1/2
                                                    text-blue-500
                                                "
                                                size={20}
                                            />

                                            <Input
                                                id="password"
                                                name="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                autoComplete="current-password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="
                                                    h-13
                                                    rounded-xl
                                                    pl-12
                                                    pr-12
                                                    text-base
                                                    shadow-sm
                                                    transition-all
                                                    focus-visible:ring-2
                                                    focus-visible:ring-blue-500
                                                "
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="
                                                    absolute
                                                    right-4
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-muted-foreground
                                                    transition-all
                                                    hover:scale-110
                                                    hover:text-foreground
                                                "
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* OPTIONS */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <Checkbox
                                                id="remember"
                                                checked={rememberMe}
                                                onCheckedChange={
                                                    setRememberMe
                                                }
                                            />

                                            <Label
                                                htmlFor="remember"
                                                className="
                                                    cursor-pointer
                                                    text-sm
                                                    font-normal
                                                    text-muted-foreground
                                                "
                                            >
                                                Remember me
                                            </Label>
                                        </div>

                                        <Link
                                            to="/forgot-password"
                                            className="
                                                text-sm
                                                font-semibold
                                                text-blue-600
                                                transition-colors
                                                hover:text-blue-500
                                                dark:text-blue-400
                                                dark:hover:text-blue-300
                                            "
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* ERROR */}

                                    {error && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            className="
                                                rounded-xl
                                                border
                                                border-red-500/20
                                                bg-red-500/10
                                                px-5
                                                py-4
                                                text-sm
                                                font-medium
                                                text-red-600
                                                dark:text-red-300
                                            "
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    {/* SIGN IN */}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="
                                            h-13
                                            w-full
                                            rounded-xl
                                            bg-gradient-to-r
                                            from-blue-600
                                            to-cyan-500
                                            text-base
                                            font-bold
                                            text-white
                                            shadow-xl
                                            shadow-blue-500/20
                                            transition-all
                                            duration-300
                                            hover:-translate-y-0.5
                                            hover:from-blue-500
                                            hover:to-cyan-400
                                            hover:shadow-2xl
                                            hover:shadow-blue-500/30
                                        "
                                    >
                                        {loading
                                            ? "Signing in..."
                                            : "Sign In to AI-PMS"}
                                    </Button>

                                    {/* SECURITY */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            border-t
                                            border-border/60
                                            pt-6
                                            text-xs
                                            text-muted-foreground
                                            sm:text-sm
                                        "
                                    >
                                        <ShieldCheck
                                            size={17}
                                            className="text-emerald-500"
                                        />

                                        Secure Africom internal access
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <div
                            className="
                                mt-6
                                text-center
                                text-sm
                                text-muted-foreground
                                xl:hidden
                            "
                        >
                            <span className="font-semibold">
                                Africom AI-PMS
                            </span>

                            {" "}· Secure project management workspace
                        </div>
                    </motion.section>
                </div>
            </main>

            {/* FOOTER */}

            <footer
                className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    hidden
                    border-t
                    border-border/30
                    bg-background/40
                    py-3
                    text-center
                    text-xs
                    text-muted-foreground
                    backdrop-blur-md
                    lg:block
                "
            >
                © {new Date().getFullYear()} Africom Technology ·
                AI-Powered Project Management System
            </footer>
        </div>
    );
}

// ============================================================
// LARGE TRUST ITEM
// ============================================================

function LargeTrustItem({ children }) {
    return (
        <motion.div
            whileHover={{
                x: 5,
            }}
            transition={{
                duration: 0.2,
            }}
            className="flex items-center gap-4"
        >
            <div
                className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    text-emerald-500
                "
            >
                <CheckCircle2 size={19} />
            </div>

            <span
                className="
                    text-base
                    font-medium
                    text-muted-foreground
                "
            >
                {children}
            </span>
        </motion.div>
    );
}

export default Login;
