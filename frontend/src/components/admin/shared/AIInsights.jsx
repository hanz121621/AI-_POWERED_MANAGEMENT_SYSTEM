import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Brain,
    ShieldAlert,
    UserX,
} from "lucide-react";

const insights = [
    {
        title: "Duplicate Email Detection",
        description:
            "AI detected 2 possible duplicate user accounts that require review.",
        icon: Brain,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Inactive Users",
        description:
            "12 users have not logged in for more than 30 days.",
        icon: UserX,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        title: "Permission Conflicts",
        description:
            "AI found 1 user with conflicting role permissions.",
        icon: ShieldAlert,
        color: "text-red-500",
        bg: "bg-red-500/10",
    },
];

function AIInsights() {

    return (

        <div className="mt-8">

            <h2 className="text-2xl font-bold mb-5">
                AI Insights
            </h2>

            <div className="grid gap-6 lg:grid-cols-3">

                {insights.map((item) => {

                    const Icon = item.icon;

                    return (

                        <Card
                            key={item.title}
                            className="
                                rounded-2xl
                                border
                                transition-all
                                duration-300
                                hover:-translate-y-2
                                hover:shadow-xl
                                cursor-pointer
                            "
                        >

                            <CardHeader>

                                <div
                                    className={`
                                        w-12
                                        h-12
                                        rounded-xl
                                        flex
                                        items-center
                                        justify-center
                                        ${item.bg}
                                    `}
                                >

                                    <Icon
                                        className={`h-6 w-6 ${item.color}`}
                                    />

                                </div>

                                <CardTitle className="mt-4 text-lg">

                                    {item.title}

                                </CardTitle>

                            </CardHeader>

                            <CardContent>

                                <p className="text-muted-foreground text-sm leading-6">

                                    {item.description}

                                </p>

                            </CardContent>

                        </Card>

                    );

                })}

            </div>

        </div>

    );

}

export default AIInsights;