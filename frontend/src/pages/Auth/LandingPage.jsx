
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

import {
    ArrowRight,
    BarChart3,
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    Cloud,
    Code2,
    Globe2,
    Layers3,
    Menu,
    Moon,
    Network,
    ShieldCheck,
    Sparkles,
    Sun,
    UsersRound,
    X,
    Zap,
} from "lucide-react";


// ============================================================
// LANDING PAGE
// AFRICOM TECHNOLOGIES — AI-PMS
// ============================================================

function LandingPage() {

    const navigate = useNavigate();

    const { theme, setTheme } = useTheme();

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const isDark = theme === "dark";


    // ========================================================
    // NAVIGATION
    // ========================================================

    const goToLogin = () => {
        setMobileMenuOpen(false);
        navigate("/login");
    };


    const scrollToSection = (id) => {

        setMobileMenuOpen(false);

        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    };


    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };


    // ========================================================
    // RETURN
    // ========================================================

    return (
        <div
            className="
                min-h-screen
                overflow-x-hidden
                bg-background
                text-foreground
                transition-colors
                duration-500
            "
        >

            {/* ========================================================
                NAVBAR
            ======================================================== */}

            <nav
                className="
                    sticky
                    top-0
                    z-50
                    border-b
                    border-border/70
                    bg-background/80
                    backdrop-blur-xl
                    transition-all
                    duration-300
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-20
                        max-w-7xl
                        items-center
                        justify-between
                        px-5
                        sm:px-8
                        lg:px-10
                    "
                >

                    {/* ==================================================
                        BRAND
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            scrollToSection("home")
                        }
                        className="
                            group
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            outline-none
                        "
                    >

                        <div
                            className="
                                relative
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-xl
                                bg-primary
                                text-primary-foreground
                                shadow-lg
                                shadow-primary/20
                                transition-all
                                duration-300
                                group-hover:scale-105
                                group-hover:shadow-xl
                                group-hover:shadow-primary/40
                            "
                        >

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-white/10
                                    opacity-0
                                    transition-opacity
                                    duration-300
                                    group-hover:opacity-100
                                "
                            />

                            <Network
                                size={22}
                                className="
                                    relative
                                    z-10
                                    transition-transform
                                    duration-300
                                    group-hover:rotate-6
                                "
                            />

                        </div>


                        <div className="text-left">

                            <div
                                className="
                                    text-lg
                                    font-extrabold
                                    tracking-tight
                                "
                            >
                                AFRICOM
                                <span className="text-primary">
                                    Technologies
                                </span>
                            </div>


                            <div
                                className="
                                    hidden
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-[0.18em]
                                    text-muted-foreground
                                    sm:block
                                "
                            >
                                AI-PMS
                            </div>

                        </div>

                    </button>


                    {/* ==================================================
                        DESKTOP NAVIGATION
                    ================================================== */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-2
                            lg:flex
                        "
                    >

                        <NavButton
                            label="Overview"
                            onClick={() =>
                                scrollToSection("overview")
                            }
                        />

                        <NavButton
                            label="Capabilities"
                            onClick={() =>
                                scrollToSection("capabilities")
                            }
                        />

                        <NavButton
                            label="How It Works"
                            onClick={() =>
                                scrollToSection("workflow")
                            }
                        />

                    </div>


                    {/* ==================================================
                        RIGHT ACTIONS
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        {/* ==================================================
                            SINGLE THEME TOGGLE
                        ================================================== */}

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={
                                isDark
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            title={
                                isDark
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            className="
                                group
                                relative
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-xl
                                border
                                border-border
                                bg-card
                                text-muted-foreground
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:border-primary/60
                                hover:bg-primary/10
                                hover:text-primary
                                hover:shadow-lg
                                hover:shadow-primary/10
                            "
                        >

                            <motion.div
                                key={isDark ? "sun" : "moon"}
                                initial={{
                                    rotate: -90,
                                    scale: 0.5,
                                    opacity: 0,
                                }}
                                animate={{
                                    rotate: 0,
                                    scale: 1,
                                    opacity: 1,
                                }}
                                transition={{
                                    duration: 0.25,
                                }}
                            >
                                {isDark ? (
                                    <Sun size={18} />
                                ) : (
                                    <Moon size={18} />
                                )}
                            </motion.div>

                        </button>


                        {/* ==================================================
                            LOGIN
                        ================================================== */}

                        <button
                            type="button"
                            onClick={goToLogin}
                            className="
                                group
                                hidden
                                items-center
                                gap-2
                                rounded-xl
                                bg-primary
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-primary-foreground
                                shadow-lg
                                shadow-primary/20
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-primary/90
                                hover:shadow-xl
                                hover:shadow-primary/40
                                sm:inline-flex
                            "
                        >

                            Access AI-PMS

                            <ArrowRight
                                size={16}
                                className="
                                    transition-transform
                                    duration-300
                                    group-hover:translate-x-1
                                "
                            />

                        </button>


                        {/* ==================================================
                            MOBILE MENU BUTTON
                        ================================================== */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(
                                    !mobileMenuOpen
                                )
                            }
                            aria-label={
                                mobileMenuOpen
                                    ? "Close menu"
                                    : "Open menu"
                            }
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-border
                                bg-card
                                text-muted-foreground
                                transition-all
                                duration-300
                                hover:border-primary/50
                                hover:bg-primary/10
                                hover:text-primary
                                lg:hidden
                            "
                        >

                            <AnimatePresence
                                mode="wait"
                                initial={false}
                            >

                                {mobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{
                                            rotate: -90,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            rotate: 0,
                                            opacity: 1,
                                        }}
                                        exit={{
                                            rotate: 90,
                                            opacity: 0,
                                        }}
                                    >
                                        <X size={20} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{
                                            rotate: 90,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            rotate: 0,
                                            opacity: 1,
                                        }}
                                        exit={{
                                            rotate: -90,
                                            opacity: 0,
                                        }}
                                    >
                                        <Menu size={20} />
                                    </motion.div>
                                )}

                            </AnimatePresence>

                        </button>

                    </div>

                </div>


                {/* ========================================================
                    MOBILE NAVIGATION
                ======================================================== */}

                <AnimatePresence>

                    {mobileMenuOpen && (

                        <motion.div
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: "auto",
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            className="
                                overflow-hidden
                                border-t
                                border-border
                                bg-background
                                px-5
                                py-5
                                shadow-lg
                                lg:hidden
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-2
                                "
                            >

                                <MobileNavButton
                                    label="Overview"
                                    onClick={() =>
                                        scrollToSection(
                                            "overview"
                                        )
                                    }
                                />

                                <MobileNavButton
                                    label="Capabilities"
                                    onClick={() =>
                                        scrollToSection(
                                            "capabilities"
                                        )
                                    }
                                />

                                <MobileNavButton
                                    label="How It Works"
                                    onClick={() =>
                                        scrollToSection(
                                            "workflow"
                                        )
                                    }
                                />


                                <button
                                    type="button"
                                    onClick={goToLogin}
                                    className="
                                        group
                                        mt-3
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-primary
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-primary-foreground
                                        shadow-lg
                                        shadow-primary/20
                                        transition-all
                                        duration-300
                                        hover:-translate-y-0.5
                                        hover:shadow-xl
                                        hover:shadow-primary/30
                                    "
                                >

                                    Access AI-PMS

                                    <ArrowRight
                                        size={16}
                                        className="
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    />

                                </button>

                            </div>

                        </motion.div>

                    )}

                </AnimatePresence>

            </nav>


            {/* ========================================================
                MAIN
            ======================================================== */}

            <main>

                {/* ========================================================
                    HERO
                ======================================================== */}

                <section
                    id="home"
                    className="
                        relative
                        isolate
                        overflow-hidden
                        border-b
                        border-border
                    "
                >

                    {/* BACKGROUND GLOW */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -left-40
                            top-10
                            -z-10
                            h-96
                            w-96
                            rounded-full
                            bg-primary/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-40
                            top-40
                            -z-10
                            h-[32rem]
                            w-[32rem]
                            rounded-full
                            bg-cyan-500/10
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            mx-auto
                            grid
                            min-h-[calc(100vh-5rem)]
                            max-w-7xl
                            items-center
                            gap-16
                            px-5
                            py-20
                            sm:px-8
                            lg:grid-cols-[1.15fr_0.85fr]
                            lg:px-10
                            lg:py-24
                        "
                    >

                        {/* ==================================================
                            HERO TEXT
                        ================================================== */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -35,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.7,
                            }}
                        >

                            {/* COMPANY LABEL */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 0.15,
                                    duration: 0.5,
                                }}
                                className="
                                    mb-7
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-primary/20
                                    bg-primary/10
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-primary
                                    shadow-sm
                                    shadow-primary/10
                                "
                            >

                                <Sparkles size={14} />

                                AFRICOM Technologies
                                · Internal Platform

                            </motion.div>


                            {/* MAIN TITLE */}

                            <h1
                                className="
                                    max-w-4xl
                                    text-5xl
                                    font-black
                                    leading-[1.03]
                                    tracking-[-0.04em]
                                    sm:text-6xl
                                    md:text-7xl
                                    lg:text-[5.4rem]
                                "
                            >

                                Deliver Digital

                                <br />

                                <span
                                    className="
                                        bg-gradient-to-r
                                        from-primary
                                        via-blue-500
                                        to-cyan-400
                                        bg-clip-text
                                        text-transparent
                                    "
                                >
                                    Projects Smarter.
                                </span>

                            </h1>


                            {/* DESCRIPTION */}

                            <p
                                className="
                                    mt-7
                                    max-w-2xl
                                    text-base
                                    leading-8
                                    text-muted-foreground
                                    sm:text-lg
                                "
                            >
                                AI-PMS gives AFRICOM Technologies one
                                intelligent workspace to plan, manage,
                                monitor, and improve the delivery of
                                technology, BPO, outsourcing, GovTech,
                                and digital transformation projects.
                            </p>


                            {/* ACTIONS */}

                            <div
                                className="
                                    mt-9
                                    flex
                                    flex-wrap
                                    gap-3
                                "
                            >

                                <motion.button
                                    type="button"
                                    onClick={goToLogin}
                                    whileHover={{
                                        y: -3,
                                        scale: 1.02,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        bg-primary
                                        px-7
                                        py-3.5
                                        text-sm
                                        font-bold
                                        text-primary-foreground
                                        shadow-xl
                                        shadow-primary/20
                                        transition-shadow
                                        duration-300
                                        hover:shadow-2xl
                                        hover:shadow-primary/40
                                    "
                                >

                                    Enter AI-PMS

                                    <ArrowRight
                                        size={18}
                                        className="
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    />

                                </motion.button>


                                <motion.button
                                    type="button"
                                    onClick={() =>
                                        scrollToSection(
                                            "capabilities"
                                        )
                                    }
                                    whileHover={{
                                        y: -3,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-border
                                        bg-card/60
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-semibold
                                        transition-all
                                        duration-300
                                        hover:border-primary/50
                                        hover:bg-primary/10
                                        hover:text-primary
                                        hover:shadow-lg
                                        hover:shadow-primary/10
                                    "
                                >

                                    Explore Platform

                                    <ChevronRight
                                        size={17}
                                        className="
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    />

                                </motion.button>

                            </div>


                            {/* TRUST ITEMS */}

                            <div
                                className="
                                    mt-8
                                    flex
                                    flex-wrap
                                    gap-x-6
                                    gap-y-3
                                    text-xs
                                    text-muted-foreground
                                "
                            >

                                <TrustItem
                                    icon={
                                        <ShieldCheck
                                            size={15}
                                            className="text-emerald-500"
                                        />
                                    }
                                    text="Secure internal platform"
                                />

                                <TrustItem
                                    icon={
                                        <CheckCircle2
                                            size={15}
                                            className="text-primary"
                                        />
                                    }
                                    text="Centralized delivery"
                                />

                                <TrustItem
                                    icon={
                                        <Zap
                                            size={15}
                                            className="text-amber-500"
                                        />
                                    }
                                    text="AI-powered insights"
                                />

                            </div>

                        </motion.div>


                        {/* ==================================================
                            HERO DASHBOARD
                        ================================================== */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 35,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            transition={{
                                duration: 0.8,
                                delay: 0.15,
                            }}
                            className="relative"
                        >

                            <DashboardPreview />

                        </motion.div>

                    </div>

                </section>


                {/* ========================================================
                    OVERVIEW
                ======================================================== */}

                <section
                    id="overview"
                    className="
                        border-b
                        border-border
                        bg-muted/20
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-7xl
                            px-5
                            py-20
                            sm:px-8
                            lg:px-10
                        "
                    >

                        <SectionHeading
                            eyebrow="One Platform"
                            title="Everything needed to deliver better projects."
                            description="AI-PMS connects people, projects, tasks, analytics, and intelligent recommendations into one operational view."
                        />


                        <div
                            className="
                                mt-12
                                grid
                                gap-5
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            <StatCard
                                icon={
                                    <Layers3 size={22} />
                                }
                                value="Projects"
                                label="Centralized delivery"
                            />

                            <StatCard
                                icon={
                                    <UsersRound size={22} />
                                }
                                value="Teams"
                                label="People & responsibilities"
                            />

                            <StatCard
                                icon={
                                    <BrainCircuit size={22} />
                                }
                                value="AI"
                                label="Risk & recommendations"
                            />

                            <StatCard
                                icon={
                                    <BarChart3 size={22} />
                                }
                                value="Insights"
                                label="Performance analytics"
                            />

                        </div>

                    </div>

                </section>


                {/* ========================================================
                    CAPABILITIES
                ======================================================== */}

                <section
                    id="capabilities"
                    className="
                        border-b
                        border-border
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-7xl
                            px-5
                            py-20
                            sm:px-8
                            lg:px-10
                        "
                    >

                        <SectionHeading
                            eyebrow="Platform Capabilities"
                            title="Built around AFRICOM's digital work."
                            description="From enterprise software and IT services to BPO, GovTech, and digital transformation, AI-PMS provides the operational structure behind project delivery."
                        />


                        <div
                            className="
                                mt-12
                                grid
                                gap-5
                                md:grid-cols-2
                                lg:grid-cols-3
                            "
                        >

                            <CapabilityCard
                                icon={
                                    <Code2 size={25} />
                                }
                                title="Software & IT Projects"
                                description="Plan development initiatives, assign technical work, monitor milestones, and keep delivery teams aligned."
                            />

                            <CapabilityCard
                                icon={
                                    <UsersRound size={25} />
                                }
                                title="BPO & Outsourcing"
                                description="Coordinate operational teams, responsibilities, workloads, assignments, and service delivery."
                            />

                            <CapabilityCard
                                icon={
                                    <Globe2 size={25} />
                                }
                                title="GovTech & Enterprise"
                                description="Structure complex institutional and enterprise initiatives with clear ownership and measurable progress."
                            />

                            <CapabilityCard
                                icon={
                                    <Cloud size={25} />
                                }
                                title="Digital Transformation"
                                description="Track transformation programs from planning through implementation, monitoring, and completion."
                            />

                            <CapabilityCard
                                icon={
                                    <BrainCircuit size={25} />
                                }
                                title="AI Project Intelligence"
                                description="Identify project risks, surface intelligent recommendations, and support better delivery decisions."
                            />

                            <CapabilityCard
                                icon={
                                    <BarChart3 size={25} />
                                }
                                title="Analytics & Reporting"
                                description="Turn project activity into useful performance insights for managers and decision-makers."
                            />

                        </div>

                    </div>

                </section>


                {/* ========================================================
                    WORKFLOW
                ======================================================== */}

                <section
                    id="workflow"
                    className="
                        border-b
                        border-border
                        bg-muted/20
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-7xl
                            px-5
                            py-20
                            sm:px-8
                            lg:px-10
                        "
                    >

                        <SectionHeading
                            eyebrow="Project Delivery"
                            title="From planning to measurable results."
                            description="AI-PMS gives every project a clear operational flow."
                        />


                        <div
                            className="
                                mt-12
                                grid
                                gap-5
                                md:grid-cols-3
                            "
                        >

                            <WorkflowCard
                                number="01"
                                title="Plan"
                                icon={
                                    <Layers3 size={22} />
                                }
                                description="Create projects, define teams, organize tasks, establish schedules, and assign responsibilities."
                            />

                            <WorkflowCard
                                number="02"
                                title="Execute"
                                icon={
                                    <Zap size={22} />
                                }
                                description="Track work, manage progress, collaborate with contributors, and keep project activities visible."
                            />

                            <WorkflowCard
                                number="03"
                                title="Improve"
                                icon={
                                    <BrainCircuit size={22} />
                                }
                                description="Use analytics and AI insights to identify risks, improve decisions, and strengthen project outcomes."
                            />

                        </div>

                    </div>

                </section>


                {/* ========================================================
                    FINAL CTA
                ======================================================== */}

                <section
                    className="
                        relative
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-gradient-to-br
                            from-primary/10
                            via-transparent
                            to-cyan-500/10
                        "
                    />


                    <div
                        className="
                            relative
                            mx-auto
                            max-w-5xl
                            px-5
                            py-24
                            text-center
                            sm:px-8
                        "
                    >

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.3,
                            }}
                        >

                            <div
                                className="
                                    mx-auto
                                    mb-6
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-primary
                                    text-primary-foreground
                                    shadow-xl
                                    shadow-primary/20
                                "
                            >
                                <BrainCircuit
                                    size={27}
                                />
                            </div>


                            <h2
                                className="
                                    text-3xl
                                    font-black
                                    tracking-tight
                                    sm:text-5xl
                                "
                            >

                                Ready to manage delivery

                                <br />

                                <span
                                    className="
                                        bg-gradient-to-r
                                        from-primary
                                        to-cyan-400
                                        bg-clip-text
                                        text-transparent
                                    "
                                >
                                    more intelligently?
                                </span>

                            </h2>


                            <p
                                className="
                                    mx-auto
                                    mt-5
                                    max-w-2xl
                                    leading-7
                                    text-muted-foreground
                                "
                            >
                                Access AFRICOM Technologies' internal
                                AI-powered project management workspace.
                            </p>


                            <motion.button
                                type="button"
                                onClick={goToLogin}
                                whileHover={{
                                    y: -4,
                                    scale: 1.02,
                                }}
                                whileTap={{
                                    scale: 0.98,
                                }}
                                className="
                                    group
                                    mt-8
                                    inline-flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    bg-primary
                                    px-7
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-primary-foreground
                                    shadow-xl
                                    shadow-primary/20
                                    transition-shadow
                                    duration-300
                                    hover:shadow-2xl
                                    hover:shadow-primary/40
                                "
                            >

                                Access AI-PMS

                                <ArrowRight
                                    size={18}
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                    "
                                />

                            </motion.button>

                        </motion.div>

                    </div>

                </section>

            </main>


            {/* ========================================================
                FOOTER
            ======================================================== */}

            <footer
                className="
                    border-t
                    border-border
                    bg-card/30
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        max-w-7xl
                        flex-col
                        gap-4
                        px-5
                        py-8
                        text-center
                        sm:px-8
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        lg:px-10
                        lg:text-left
                    "
                >

                    <div>

                        <p
                            className="
                                text-sm
                                font-bold
                            "
                        >
                            AFRICOM Technologies
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-muted-foreground
                            "
                        >
                            AI-Powered Project Management System
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-xs
                            text-muted-foreground
                        "
                    >

                        <ShieldCheck
                            size={14}
                            className="text-emerald-500"
                        />

                        Internal enterprise platform

                    </div>


                    <p
                        className="
                            text-xs
                            text-muted-foreground
                        "
                    >
                        © {new Date().getFullYear()} AFRICOM Technologies
                    </p>

                </div>

            </footer>

        </div>
    );
}


// ============================================================
// NAV BUTTON
// ============================================================

function NavButton({
    label,
    onClick,
}) {

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                relative
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-medium
                text-muted-foreground
                transition-all
                duration-300
                hover:bg-primary/10
                hover:text-primary
            "
        >
            {label}
        </button>
    );
}


// ============================================================
// MOBILE NAV BUTTON
// ============================================================

function MobileNavButton({
    label,
    onClick,
}) {

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                rounded-xl
                px-4
                py-3
                text-left
                text-sm
                font-medium
                text-muted-foreground
                transition-all
                duration-300
                hover:bg-primary/10
                hover:pl-5
                hover:text-primary
            "
        >
            {label}
        </button>
    );
}


// ============================================================
// TRUST ITEM
// ============================================================

function TrustItem({
    icon,
    text,
}) {

    return (
        <div
            className="
                flex
                items-center
                gap-2
            "
        >
            {icon}
            {text}
        </div>
    );
}


// ============================================================
// SECTION HEADING
// ============================================================

function SectionHeading({
    eyebrow,
    title,
    description,
}) {

    return (
        <div className="max-w-3xl">

            <div
                className="
                    mb-4
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-primary
                "
            >

                <span
                    className="
                        h-px
                        w-7
                        bg-primary
                    "
                />

                {eyebrow}

            </div>


            <h2
                className="
                    text-3xl
                    font-black
                    tracking-tight
                    sm:text-4xl
                "
            >
                {title}
            </h2>


            <p
                className="
                    mt-4
                    max-w-2xl
                    text-sm
                    leading-7
                    text-muted-foreground
                    sm:text-base
                "
            >
                {description}
            </p>

        </div>
    );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    icon,
    value,
    label,
}) {

    return (
        <motion.div
            whileHover={{
                y: -7,
                scale: 1.01,
            }}
            transition={{
                duration: 0.2,
            }}
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-card
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:border-primary/40
                hover:shadow-xl
                hover:shadow-primary/10
            "
        >

            {/* HOVER LIGHT */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-28
                    w-28
                    rounded-full
                    bg-primary/10
                    opacity-0
                    blur-2xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                "
            />


            <div
                className="
                    relative
                    z-10
                    mb-5
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                    transition-all
                    duration-300
                    group-hover:bg-primary
                    group-hover:text-primary-foreground
                    group-hover:shadow-lg
                    group-hover:shadow-primary/30
                "
            >
                {icon}
            </div>


            <p
                className="
                    relative
                    z-10
                    text-xl
                    font-bold
                "
            >
                {value}
            </p>


            <p
                className="
                    relative
                    z-10
                    mt-1
                    text-sm
                    text-muted-foreground
                "
            >
                {label}
            </p>

        </motion.div>
    );
}


// ============================================================
// CAPABILITY CARD
// ============================================================

function CapabilityCard({
    icon,
    title,
    description,
}) {

    return (
        <motion.div
            whileHover={{
                y: -7,
            }}
            transition={{
                duration: 0.25,
            }}
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-card
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:border-primary/50
                hover:shadow-xl
                hover:shadow-primary/10
            "
        >

            {/* HOVER LIGHT */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-36
                    w-36
                    rounded-full
                    bg-primary/10
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                "
            />


            <div
                className="
                    relative
                    z-10
                    mb-6
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-primary/20
                    bg-primary/10
                    text-primary
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:bg-primary
                    group-hover:text-primary-foreground
                    group-hover:shadow-lg
                    group-hover:shadow-primary/30
                "
            >
                {icon}
            </div>


            <h3
                className="
                    relative
                    z-10
                    text-lg
                    font-bold
                    transition-colors
                    duration-300
                    group-hover:text-primary
                "
            >
                {title}
            </h3>


            <p
                className="
                    relative
                    z-10
                    mt-3
                    text-sm
                    leading-7
                    text-muted-foreground
                "
            >
                {description}
            </p>


            <div
                className="
                    relative
                    z-10
                    mt-5
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-primary
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:opacity-100
                "
            >
                Explore capability

                <ChevronRight
                    size={14}
                />

            </div>

        </motion.div>
    );
}


// ============================================================
// WORKFLOW CARD
// ============================================================

function WorkflowCard({
    number,
    title,
    icon,
    description,
}) {

    return (
        <motion.div
            whileHover={{
                y: -7,
            }}
            transition={{
                duration: 0.25,
            }}
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-card
                p-7
                shadow-sm
                transition-all
                duration-300
                hover:border-primary/40
                hover:shadow-xl
                hover:shadow-primary/10
            "
        >

            {/* BACKGROUND NUMBER */}

            <div
                className="
                    pointer-events-none
                    absolute
                    right-5
                    top-4
                    text-5xl
                    font-black
                    text-primary/5
                    transition-all
                    duration-500
                    group-hover:scale-110
                    group-hover:text-primary/10
                "
            >
                {number}
            </div>


            {/* HOVER LIGHT */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-36
                    w-36
                    rounded-full
                    bg-primary/10
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                "
            />


            <div
                className="
                    relative
                    z-10
                    mb-6
                    flex
                    items-center
                    justify-between
                "
            >

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary/10
                        text-primary
                        transition-all
                        duration-300
                        group-hover:bg-primary
                        group-hover:text-primary-foreground
                        group-hover:shadow-lg
                        group-hover:shadow-primary/30
                    "
                >
                    {icon}
                </div>


                <span
                    className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                        text-muted-foreground
                    "
                >
                    Step {number}
                </span>

            </div>


            <h3
                className="
                    relative
                    z-10
                    text-xl
                    font-bold
                    transition-colors
                    duration-300
                    group-hover:text-primary
                "
            >
                {title}
            </h3>


            <p
                className="
                    relative
                    z-10
                    mt-3
                    text-sm
                    leading-7
                    text-muted-foreground
                "
            >
                {description}
            </p>

        </motion.div>
    );
}


// ============================================================
// DASHBOARD PREVIEW
// ============================================================

function DashboardPreview() {

    return (
        <motion.div
            animate={{
                y: [0, -8, 0],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className="
                relative
                mx-auto
                w-full
                max-w-xl
            "
        >

            {/* GLOW */}

            <div
                className="
                    absolute
                    inset-10
                    rounded-full
                    bg-primary/20
                    blur-3xl
                "
            />


            {/* WINDOW */}

            <div
                className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-border
                    bg-card/95
                    shadow-2xl
                    shadow-primary/10
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    hover:border-primary/30
                    hover:shadow-primary/20
                "
            >

                {/* WINDOW HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-border
                        px-5
                        py-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <div
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-red-400
                            "
                        />

                        <div
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-amber-400
                            "
                        />

                        <div
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-emerald-400
                            "
                        />

                    </div>


                    <span
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-widest
                            text-muted-foreground
                        "
                    >
                        AI-PMS Dashboard
                    </span>

                </div>


                {/* DASHBOARD */}

                <div className="p-5">

                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                Project Overview
                            </p>

                            <h3
                                className="
                                    mt-1
                                    text-xl
                                    font-bold
                                "
                            >
                                Digital Delivery
                            </h3>

                        </div>


                        <div
                            className="
                                rounded-lg
                                bg-emerald-500/10
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-emerald-500
                            "
                        >
                            On Track
                        </div>

                    </div>


                    {/* PROGRESS */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-muted/40
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <span
                                className="
                                    text-xs
                                    font-medium
                                    text-muted-foreground
                                "
                            >
                                Overall Progress
                            </span>

                            <span
                                className="
                                    text-sm
                                    font-bold
                                    text-primary
                                "
                            >
                                78%
                            </span>

                        </div>


                        <div
                            className="
                                mt-3
                                h-2
                                overflow-hidden
                                rounded-full
                                bg-muted
                            "
                        >

                            <motion.div
                                initial={{
                                    width: 0,
                                }}
                                animate={{
                                    width: "78%",
                                }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.5,
                                }}
                                className="
                                    h-full
                                    rounded-full
                                    bg-gradient-to-r
                                    from-primary
                                    to-cyan-400
                                "
                            />

                        </div>

                    </div>


                    {/* MINI CARDS */}

                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-2
                            gap-3
                        "
                    >

                        <MiniDashboardCard
                            icon={
                                <UsersRound
                                    size={17}
                                />
                            }
                            value="24"
                            label="Team Members"
                        />

                        <MiniDashboardCard
                            icon={
                                <CheckCircle2
                                    size={17}
                                />
                            }
                            value="86"
                            label="Tasks Completed"
                        />

                    </div>


                    {/* AI INSIGHT */}

                    <div
                        className="
                            mt-4
                            rounded-2xl
                            border
                            border-primary/20
                            bg-primary/5
                            p-4
                            transition-all
                            duration-300
                            hover:border-primary/40
                            hover:bg-primary/10
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                text-primary
                            "
                        >

                            <BrainCircuit
                                size={17}
                            />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                "
                            >
                                AI Insight
                            </span>

                        </div>


                        <p
                            className="
                                mt-2
                                text-xs
                                leading-5
                                text-muted-foreground
                            "
                        >
                            Project delivery is progressing well.
                            AI-PMS detected no critical delivery
                            risks in the current sprint.
                        </p>

                    </div>

                </div>

            </div>

        </motion.div>
    );
}


// ============================================================
// MINI DASHBOARD CARD
// ============================================================

function MiniDashboardCard({
    icon,
    value,
    label,
}) {

    return (
        <div
            className="
                group
                rounded-xl
                border
                border-border
                bg-background
                p-3
                transition-all
                duration-300
                hover:border-primary/40
                hover:bg-primary/5
                hover:shadow-md
                hover:shadow-primary/5
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                    text-primary
                "
            >

                <div
                    className="
                        transition-transform
                        duration-300
                        group-hover:scale-110
                    "
                >
                    {icon}
                </div>


                <span
                    className="
                        text-lg
                        font-bold
                    "
                >
                    {value}
                </span>

            </div>


            <p
                className="
                    mt-1
                    text-[10px]
                    text-muted-foreground
                "
            >
                {label}
            </p>

        </div>
    );
}


// ============================================================
// EXPORT
// ============================================================

export default LandingPage;
