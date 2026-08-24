import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import {
    Shield,
    Briefcase,
    Users,
    Activity,
} from "lucide-react";

function SystemOverview() {
    const users = [
        {
            title: "Administrators",
            value: 5,
            progress: 10,
            icon: Shield,
            color: "text-red-500",
        },
        {
            title: "Managers",
            value: 18,
            progress: 35,
            icon: Briefcase,
            color: "text-blue-500",
        },
        {
            title: "Contributors",
            value: 127,
            progress: 85,
            icon: Users,
            color: "text-green-500",
        },
    ];

    return (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card className="rounded-2xl border-border bg-card shadow-sm lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-foreground">
                        User Overview
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {users.map((user) => {
                        const Icon = user.icon;

                        return (
                            <div key={user.title}>
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            className={`h-5 w-5 ${user.color}`}
                                        />

                                        <span className="text-foreground">
                                            {user.title}
                                        </span>
                                    </div>

                                    <span className="font-semibold text-foreground">
                                        {user.value}
                                    </span>
                                </div>

                                <Progress value={user.progress} />
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                    <CardTitle className="text-foreground">
                        System Health
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="mb-4 flex items-center gap-3">
                        <Activity className="h-7 w-7 text-green-500" />

                        <span className="text-3xl font-bold text-foreground">
                            98%
                        </span>
                    </div>

                    <Progress value={98} />

                    <p className="mt-4 text-sm text-muted-foreground">
                        AI services, authentication and database are running
                        normally.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default SystemOverview;