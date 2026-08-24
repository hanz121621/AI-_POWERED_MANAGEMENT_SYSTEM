import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Users,
    UserCheck,
    UserX,
    TriangleAlert,
} from "lucide-react";

const stats = [
    {
        title: "Total Users",
        value: "150",
        icon: Users,
        color: "text-blue-500",
    },
    {
        title: "Active Users",
        value: "138",
        icon: UserCheck,
        color: "text-green-500",
    },
    {
        title: "Inactive Users",
        value: "12",
        icon: UserX,
        color: "text-orange-500",
    },
    {
        title: "AI Alerts",
        value: "5",
        icon: TriangleAlert,
        color: "text-red-500",
    },
];

function AdminStats() {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => {

                const Icon = item.icon;

                return (

                    <Card
                        key={item.title}
                        className="
                            bg-slate-900
                            border
                            border-slate-800
                            text-white
                            rounded-2xl
                            transition-all
                            duration-300
                            hover:-translate-y-2
                            hover:scale-[1.02]
                            hover:shadow-2xl
                            cursor-pointer
                        "
                    >

                        <CardHeader className="flex flex-row items-center justify-between">

                            <CardTitle className="text-sm font-medium text-slate-400">
                                {item.title}
                            </CardTitle>

                            <Icon
                                className={`
                                    h-6
                                    w-6
                                    ${item.color}
                                    transition-transform
                                    duration-300
                                    group-hover:rotate-6
                                `}
                            />

                        </CardHeader>

                        <CardContent>

                            <h2 className="text-4xl font-bold">
                                {item.value}
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Updated just now
                            </p>

                        </CardContent>

                    </Card>

                );

            })}

        </div>
    );
}

export default AdminStats;