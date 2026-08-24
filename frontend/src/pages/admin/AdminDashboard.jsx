import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Users,
    FolderKanban,
    AlertTriangle,
    UserRound,
    Activity,
    BrainCircuit,
    ArrowUpRight,
    UserPlus,
    Settings,
    ShieldAlert,
    CheckCircle2,
    Clock3,
    Sparkles,
    TrendingUp,
    Plus,
    ShieldCheck,
} from "lucide-react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUsers } from "@/services/userService";

function AdminDashboard() {
    const navigate = useNavigate();

   const [users, setUsers] = useState([]);
const [, setLoadingUsers] = useState(true);

useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
        try {
            setLoadingUsers(true);

            const result = await getUsers();

            if (!mounted) return;

            // Support either:
            // 1. direct array response
            // 2. { data: [...] }
            const userList = Array.isArray(result)
                ? result
                : Array.isArray(result?.data)
                    ? result.data
                    : [];

            setUsers(userList);
        } catch (error) {
            console.error(
                "ADMIN DASHBOARD - GET USERS ERROR:",
                error
            );

            if (mounted) {
                setUsers([]);
            }
        } finally {
            if (mounted) {
                setLoadingUsers(false);
            }
        }
    };

    loadUsers();

    return () => {
        mounted = false;
    };
}, []);

    /* =========================================================
       USER STATISTICS
    ========================================================= */

    const totalUsers = users.length;

const activeUsers = users.filter(
    (user) => user.isActive === true
).length;

const inactiveUsers = users.filter(
    (user) => user.isActive === false
).length;

const admins = users.filter(
    (user) => Number(user.role) === 1
).length;

const managers = users.filter(
    (user) => Number(user.role) === 2
).length;

const contributors = users.filter(
    (user) => Number(user.role) === 3
).length;

    /* =========================================================
       DASHBOARD STATISTICS
    ========================================================= */

    const statistics = [
        {
            title: "Total Users",
            value: totalUsers,
            description: `${activeUsers} active users`,
            icon: Users,
            path: "/admin/users",
            tone: "primary",
        },
        {
            title: "Total Projects",
            value: "0",
            description: "Projects in system",
            icon: FolderKanban,
            path: "/admin/projects",
            tone: "success",
        },
        {
            title: "AI Risk Alerts",
            value: "0",
            description: "Projects require attention",
            icon: AlertTriangle,
            path: "/admin/ai",
            tone: "danger",
        },
        {
            title: "Team Members",
            value: contributors + managers,
            description: "Users assigned to teams",
            icon: UserRound,
            path: "/admin/teams",
            tone: "info",
        },
    ];

    /* =========================================================
       USER ANALYTICS
    ========================================================= */

    const userAnalytics = [
        {
            label: "Administrators",
            value: admins,
            percentage:
                totalUsers > 0
                    ? Math.round((admins / totalUsers) * 100)
                    : 0,
            tone: "danger",
        },
        {
            label: "Managers",
            value: managers,
            percentage:
                totalUsers > 0
                    ? Math.round((managers / totalUsers) * 100)
                    : 0,
            tone: "primary",
        },
        {
            label: "Contributors",
            value: contributors,
            percentage:
                totalUsers > 0
                    ? Math.round((contributors / totalUsers) * 100)
                    : 0,
            tone: "success",
        },
    ];

    /* =========================================================
       USER BREAKDOWN CHART DATA
    ========================================================= */

    const userBreakdownData = [
        {
            name: "Administrators",
            value: admins,
        },
        {
            name: "Managers",
            value: managers,
        },
        {
            name: "Contributors",
            value: contributors,
        },
    ];

    /* =========================================================
       USER ACTIVITY CHART DATA
    ========================================================= */

    const userActivityData = [
        {
            name: "Users",
            Active: activeUsers,
            Inactive: inactiveUsers,
        },
    ];

    /* =========================================================
       PROJECT DATA
    ========================================================= */

    const projectProgress = [];

    /* =========================================================
       AI DATA
    ========================================================= */

    const aiInsights = [];

    const riskPrediction = [
        {
            label: "High Risk",
            value: 0,
            description: "Immediate attention",
            tone: "danger",
            icon: AlertTriangle,
        },
        {
            label: "Medium Risk",
            value: 0,
            description: "Needs monitoring",
            tone: "warning",
            icon: Clock3,
        },
        {
            label: "Low Risk",
            value: 0,
            description: "Currently stable",
            tone: "success",
            icon: CheckCircle2,
        },
    ];

    /* =========================================================
       RECENT ACTIVITY
    ========================================================= */

    const recentActivities = users
    .slice()
    .reverse()
    .slice(0, 5)
    .map((user) => ({
        text: `User account created: ${
            user.fullName ||
            user.email ||
            "Unknown user"
        }`,
        time: "Recent",
        icon: UserPlus,
    }));
    /* =========================================================
       QUICK ACTIONS
    ========================================================= */

    const quickActions = [
        {
            title: "Manage Users",
            description: "View and manage system users",
            icon: Users,
            path: "/admin/users",
            tone: "primary",
        },
        {
            title: "Manage Projects",
            description: "View project information",
            icon: FolderKanban,
            path: "/admin/projects",
            tone: "success",
        },
        {
            title: "Manage Teams",
            description: "View team information",
            icon: UserRound,
            path: "/admin/teams",
            tone: "info",
        },
        {
            title: "System Settings",
            description: "Configure system settings",
            icon: Settings,
            path: "/admin/settings",
            tone: "warning",
        },
    ];

    /* =========================================================
       COLOR / TONE STYLES
    ========================================================= */

    const toneStyles = {
        primary: {
            icon: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
            dot: "bg-blue-500",
            progress: "bg-blue-500",
            soft: "bg-blue-50/60 dark:bg-blue-500/[0.06]",
            border:
                "border-blue-200/70 dark:border-blue-500/20",
        },

        success: {
            icon:
                "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
            dot: "bg-emerald-500",
            progress: "bg-emerald-500",
            soft:
                "bg-emerald-50/60 dark:bg-emerald-500/[0.06]",
            border:
                "border-emerald-200/70 dark:border-emerald-500/20",
        },

        danger: {
            icon:
                "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
            dot: "bg-rose-500",
            progress: "bg-rose-500",
            soft:
                "bg-rose-50/60 dark:bg-rose-500/[0.06]",
            border:
                "border-rose-200/70 dark:border-rose-500/20",
        },

        warning: {
            icon:
                "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
            dot: "bg-amber-500",
            progress: "bg-amber-500",
            soft:
                "bg-amber-50/60 dark:bg-amber-500/[0.06]",
            border:
                "border-amber-200/70 dark:border-amber-500/20",
        },

        info: {
            icon:
                "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
            dot: "bg-cyan-500",
            progress: "bg-cyan-500",
            soft:
                "bg-cyan-50/60 dark:bg-cyan-500/[0.06]",
            border:
                "border-cyan-200/70 dark:border-cyan-500/20",
        },
    };

    /* =========================================================
       COMMON STYLES
    ========================================================= */

    const cardStyle =
        "border-border/70 bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300/70 hover:bg-blue-50/40 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-400/30 dark:hover:bg-blue-500/[0.06] dark:hover:shadow-blue-500/10";

    const rowStyle =
        "rounded-xl border border-transparent p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-200/70 hover:bg-blue-50/40 hover:shadow-sm dark:hover:border-blue-500/20 dark:hover:bg-blue-500/[0.05] dark:hover:shadow-blue-500/5";

    const actionStyle =
        "group rounded-xl border border-border bg-card p-5 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300/70 hover:bg-blue-50/40 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-400/30 dark:hover:bg-blue-500/[0.06] dark:hover:shadow-blue-500/10";

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="relative min-h-full overflow-hidden bg-background text-foreground">
            {/* Background decorations */}

            <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-500/[0.04] blur-3xl dark:bg-blue-400/[0.05]" />

            <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-cyan-500/[0.025] blur-3xl dark:bg-cyan-400/[0.03]" />

            <div className="relative space-y-7">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors duration-300 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:border-blue-400/30 dark:hover:bg-blue-500/[0.15]">

                            <Sparkles className="h-3.5 w-3.5" />

                            AI-PMS Administration
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            Admin Dashboard
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                            Monitor users, projects, teams, system activity
                            and AI-powered project intelligence from one place.
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate("/admin/users")}
                        className="w-fit gap-2 rounded-xl bg-blue-600 px-5 text-white shadow-sm shadow-blue-600/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 dark:bg-blue-500 dark:hover:bg-blue-600 dark:hover:shadow-blue-500/20"
                    >
                        <Plus className="h-4 w-4" />

                        Add User

                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </section>

                {/* =====================================================
                    STATISTICS
                ===================================================== */}

                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {statistics.map((item) => {
                        const Icon = item.icon;
                        const tone = toneStyles[item.tone];

                        return (
                            <Card
                                key={item.title}
                                onClick={() => navigate(item.path)}
                                className={`${cardStyle} group cursor-pointer overflow-hidden`}
                            >
                                <CardContent className="p-5 sm:p-6">

                                    <div className="flex items-start justify-between gap-4">

                                        <div className="min-w-0">

                                            <p className="text-sm font-medium text-muted-foreground">
                                                {item.title}
                                            </p>

                                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground transition-transform duration-300 group-hover:scale-[1.02]">
                                                {item.value}
                                            </h2>

                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">

                                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 transition-colors duration-300 group-hover:bg-emerald-500/15">

                                                    <TrendingUp className="h-3 w-3 text-emerald-500" />

                                                </span>

                                                {item.description}
                                            </div>
                                        </div>

                                        <div
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone.icon} transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="mt-5 h-px w-full bg-border/60 transition-colors duration-300 group-hover:bg-blue-200/60 dark:group-hover:bg-blue-500/20" />

                                    <div className="mt-4 flex items-center justify-between text-xs">

                                        <span className="text-muted-foreground transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            View details
                                        </span>

                                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500" />

                                    </div>

                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                {/* =====================================================
                    USER BREAKDOWN + ACTIVITY CHARTS
                ===================================================== */}

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {/* USER BREAKDOWN */}

                    <Card className={cardStyle}>

                        <CardHeader>

                            <div className="flex items-center justify-between">

                                <div>
                                    <CardTitle className="text-lg text-foreground">
                                        User Breakdown
                                    </CardTitle>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Distribution of users by role
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                    <Users className="h-5 w-5" />
                                </div>

                            </div>

                        </CardHeader>

                        <CardContent>

                            {totalUsers === 0 ? (

                                <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">

                                    <p className="text-sm text-muted-foreground">
                                        No user data available.
                                    </p>

                                </div>

                            ) : (

                                <div className="h-[320px] w-full">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <PieChart>

                                            <Pie
                                                data={userBreakdownData}
                                                cx="50%"
                                                cy="45%"
                                                innerRadius={75}
                                                outerRadius={110}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >

                                                <Cell fill="#3b82f6" />

                                                <Cell fill="#8b5cf6" />

                                                <Cell fill="#10b981" />

                                            </Pie>

                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor:
                                                        "var(--card)",
                                                    border:
                                                        "1px solid var(--border)",
                                                    borderRadius:
                                                        "12px",
                                                    color:
                                                        "var(--foreground)",
                                                }}
                                            />

                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                            />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>

                            )}

                        </CardContent>

                    </Card>


                    {/* USER ACTIVITY */}

                    <Card className={cardStyle}>

                        <CardHeader>

                            <div className="flex items-center justify-between">

                                <div>

                                    <CardTitle className="text-lg text-foreground">
                                        User Activity Analysis
                                    </CardTitle>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Active and inactive users
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    <Activity className="h-5 w-5" />
                                </div>

                            </div>

                        </CardHeader>

                        <CardContent>

                            {totalUsers === 0 ? (

                                <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">

                                    <p className="text-sm text-muted-foreground">
                                        No user activity data available.
                                    </p>

                                </div>

                            ) : (

                                <div className="h-[320px] w-full">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={userActivityData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -20,
                                                bottom: 10,
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="var(--border)"
                                            />

                                            <XAxis
                                                dataKey="name"
                                                stroke="var(--muted-foreground)"
                                            />

                                            <YAxis
                                                allowDecimals={false}
                                                stroke="var(--muted-foreground)"
                                            />

                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor:
                                                        "var(--card)",
                                                    border:
                                                        "1px solid var(--border)",
                                                    borderRadius:
                                                        "12px",
                                                    color:
                                                        "var(--foreground)",
                                                }}
                                            />

                                            <Legend />

                                            <Bar
                                                dataKey="Active"
                                                fill="#10b981"
                                                radius={[
                                                    8,
                                                    8,
                                                    0,
                                                    0,
                                                ]}
                                            />

                                            <Bar
                                                dataKey="Inactive"
                                                fill="#f43f5e"
                                                radius={[
                                                    8,
                                                    8,
                                                    0,
                                                    0,
                                                ]}
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                            )}

                        </CardContent>

                    </Card>

                </section>

                {/* =====================================================
                    USER ANALYTICS + PROJECT PROGRESS
                ===================================================== */}

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {/* USER ANALYTICS */}

                    <Card className={cardStyle}>

                        <CardHeader>

                            <div className="flex items-center justify-between">

                                <div>

                                    <CardTitle className="text-lg text-foreground">
                                        User Analytics
                                    </CardTitle>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Distribution of users by role
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                    <Users className="h-5 w-5" />
                                </div>

                            </div>

                        </CardHeader>

                        <CardContent className="space-y-3">

                            {userAnalytics.map((item) => {

                                const tone =
                                    toneStyles[item.tone];

                                return (
                                    <div
                                        key={item.label}
                                        className={rowStyle}
                                    >

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-2.5">

                                                <span
                                                    className={`h-2.5 w-2.5 rounded-full ${tone.dot}`}
                                                />

                                                <span className="text-sm font-medium text-foreground">
                                                    {item.label}
                                                </span>

                                            </div>

                                            <div className="text-right">

                                                <span className="text-sm font-bold text-foreground">
                                                    {item.value}
                                                </span>

                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    {item.percentage}%
                                                </span>

                                            </div>

                                        </div>

                                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">

                                            <div
                                                className={`h-full rounded-full ${tone.progress} transition-all duration-700`}
                                                style={{
                                                    width: `${item.percentage}%`,
                                                }}
                                            />

                                        </div>

                                    </div>
                                );
                            })}

                        </CardContent>

                    </Card>


                    {/* PROJECT PROGRESS */}

                    <Card className={cardStyle}>

                        <CardHeader>

                            <div className="flex items-center justify-between">

                                <div>

                                    <CardTitle className="text-lg text-foreground">
                                        Project Progress
                                    </CardTitle>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Monitor active project delivery
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    <FolderKanban className="h-5 w-5" />
                                </div>

                            </div>

                        </CardHeader>

                        <CardContent>

                            {projectProgress.length === 0 ? (

                                <div className="group flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

                                        <FolderKanban className="h-7 w-7" />

                                    </div>

                                    <p className="mt-4 font-semibold text-foreground">
                                        No projects created yet
                                    </p>

                                    <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                                        Project progress will appear here once
                                        projects are available.
                                    </p>

                                    <Button
                                        variant="outline"
                                        className="mt-4 rounded-xl"
                                        onClick={() =>
                                            navigate(
                                                "/admin/projects"
                                            )
                                        }
                                    >
                                        Manage Projects

                                        <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Button>

                                </div>

                            ) : (

                                <div className="space-y-4">

                                    {projectProgress.map(
                                        (project) => (

                                            <div
                                                key={project.name}
                                                className={rowStyle}
                                            >

                                                <div className="flex items-center justify-between">

                                                    <p className="text-sm font-medium text-foreground">
                                                        {project.name}
                                                    </p>

                                                    <span className="text-sm font-bold text-foreground">
                                                        {project.progress}%
                                                    </span>

                                                </div>

                                                <Progress
                                                    value={
                                                        project.progress
                                                    }
                                                    className="mt-3"
                                                />

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </CardContent>

                    </Card>

                </section>

                {/* =====================================================
                    AI INSIGHTS + RISK PREDICTION
                ===================================================== */}

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {/* AI INSIGHTS */}

                    <Card className={cardStyle}>

                        <CardHeader>

                            <div className="flex items-center justify-between">

                                <div>

                                    <CardTitle className="text-lg text-foreground">
                                        AI Insights
                                    </CardTitle>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Intelligent analysis from project data
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                    <BrainCircuit className="h-5 w-5" />
                                </div>

                            </div>

                        </CardHeader>

                        <CardContent>

                            {aiInsights.length === 0 ? (

                                <div className="group relative overflow-hidden rounded-xl border border-blue-200/70 bg-blue-50/50 p-8 text-center dark:border-blue-500/20 dark:bg-blue-500/[0.06]">

                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 dark:bg-blue-500">

                                        <BrainCircuit className="h-7 w-7" />

                                    </div>

                                    <h3 className="mt-4 font-semibold text-foreground">
                                        AI intelligence is ready
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                                        AI insights will appear here when
                                        project and task data becomes
                                        available.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {aiInsights.map(
                                        (insight) => (

                                            <div
                                                key={insight.title}
                                                className={rowStyle}
                                            >
                                                {insight.title}
                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </CardContent>

                    </Card>


                    {/* AI RISK PREDICTION */}

                    <Card className={cardStyle}>

                        <CardHeader>

                            <div className="flex items-center justify-between">

                                <div>

                                    <CardTitle className="text-lg text-foreground">
                                        AI Risk Prediction
                                    </CardTitle>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Current project risk levels
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                    <ShieldAlert className="h-5 w-5" />
                                </div>

                            </div>

                        </CardHeader>

                        <CardContent className="space-y-3">

                            {riskPrediction.map((risk) => {

                                const Icon = risk.icon;
                                const tone =
                                    toneStyles[risk.tone];

                                return (
                                    <div
                                        key={risk.label}
                                        className={`group flex items-center justify-between rounded-xl border p-4 transition-all duration-300 ${tone.border} ${tone.soft}`}
                                    >

                                        <div className="flex items-center gap-3">

                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone.icon}`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            <div>

                                                <p className="text-sm font-semibold text-foreground">
                                                    {risk.label}
                                                </p>

                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {risk.description}
                                                </p>

                                            </div>

                                        </div>

                                        <span className="text-2xl font-bold text-foreground">
                                            {risk.value}
                                        </span>

                                    </div>
                                );
                            })}

                        </CardContent>

                    </Card>

                </section>

                {/* =====================================================
                    RECENT ACTIVITY
                ===================================================== */}

                <Card className={cardStyle}>

                    <CardHeader>

                        <div className="flex items-center justify-between">

                            <div>

                                <CardTitle className="text-lg text-foreground">
                                    Recent Activity
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Latest activity across the system
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                <Activity className="h-5 w-5" />
                            </div>

                        </div>

                    </CardHeader>

                    <CardContent>

                        {recentActivities.length === 0 ? (

                            <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
                                No activity available yet.
                            </div>

                        ) : (

                            <div className="space-y-1">

                                {recentActivities.map(
                                    (activity, index) => {

                                        const Icon =
                                            activity.icon;

                                        return (
                                            <div
                                                key={`${activity.text}-${index}`}
                                                className="group flex items-center justify-between gap-4 rounded-xl p-3 transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-500/[0.05]"
                                            >

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">

                                                        <Icon className="h-4 w-4" />

                                                    </div>

                                                    <p className="truncate text-sm font-medium text-foreground">
                                                        {activity.text}
                                                    </p>

                                                </div>

                                                <span className="shrink-0 text-xs text-muted-foreground">
                                                    {activity.time}
                                                </span>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </CardContent>

                </Card>

                {/* =====================================================
                    QUICK ACTIONS
                ===================================================== */}

                <Card className={cardStyle}>

                    <CardHeader>

                        <CardTitle className="text-lg text-foreground">
                            Quick Actions
                        </CardTitle>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Frequently used administration tools
                        </p>

                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                            {quickActions.map((action) => {

                                const Icon = action.icon;
                                const tone =
                                    toneStyles[action.tone];

                                return (
                                    <button
                                        key={action.title}
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                action.path
                                            )
                                        }
                                        className={actionStyle}
                                    >

                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.icon} transition-all duration-300 group-hover:scale-110`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="mt-4">

                                            <div className="flex items-center justify-between gap-3">

                                                <h3 className="text-sm font-bold text-foreground">
                                                    {action.title}
                                                </h3>

                                                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-blue-500" />

                                            </div>

                                            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                                {action.description}
                                            </p>

                                        </div>

                                    </button>
                                );
                            })}

                        </div>

                    </CardContent>

                </Card>

                {/* =====================================================
                    SYSTEM STATUS
                ===================================================== */}

                <div className="group flex flex-col gap-4 rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100/60 hover:shadow-md dark:border-emerald-500/20 dark:bg-emerald-500/[0.06] sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

                            <ShieldCheck className="h-5 w-5" />

                        </div>

                        <div>

                            <p className="font-semibold text-foreground">
                                System is operating normally
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                All available administration services are
                                currently operational.
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">

                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                        Operational

                    </div>

                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;