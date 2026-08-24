import {
    UserPlus,
    UserCog,
    UserMinus,
    ShieldCheck,
    KeyRound,
    UserCheck
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

function RecentActivity() {
    const activities = [
        {
            id: 1,
            title: "New user created",
            description:
                "Admin created a new Manager account for John Smith",
            time: "5 minutes ago",
            type: "Create",
            icon: UserPlus
        },
        {
            id: 2,
            title: "User profile updated",
            description:
                "User information was updated successfully",
            time: "20 minutes ago",
            type: "Update",
            icon: UserCog
        },
        {
            id: 3,
            title: "Role assigned",
            description:
                "Manager role assigned to a user account",
            time: "1 hour ago",
            type: "Role",
            icon: ShieldCheck
        },
        {
            id: 4,
            title: "Permission updated",
            description:
                "User permissions were modified by Admin",
            time: "2 hours ago",
            type: "Permission",
            icon: KeyRound
        },
        {
            id: 5,
            title: "User activated",
            description:
                "Inactive account access was restored",
            time: "Yesterday",
            type: "Active",
            icon: UserCheck
        },
        {
            id: 6,
            title: "User deleted",
            description:
                "User account was removed from the system",
            time: "Yesterday",
            type: "Delete",
            icon: UserMinus
        }
    ];

    return (
        <Card className="
            mt-6
            shadow-sm
            bg-card
            text-card-foreground
        ">

            <CardHeader>

                <CardTitle className="
                    text-xl
                    font-semibold
                    text-foreground
                ">
                    Recent Activity
                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="
                    space-y-5
                ">

                    {activities.map((activity) => {

                        const Icon = activity.icon;

                        return (
                            <div
                                key={activity.id}
                                className="
                                    flex
                                    items-start
                                    gap-4
                                    border-b
                                    border-border
                                    pb-4
                                    last:border-none
                                "
                            >

                                {/* Activity Icon */}

                                <div className="
                                    rounded-full
                                    bg-primary/10
                                    p-2
                                    shrink-0
                                ">

                                    <Icon
                                        className="
                                            h-5
                                            w-5
                                            text-primary
                                        "
                                    />

                                </div>

                                {/* Activity Content */}

                                <div className="
                                    flex-1
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    ">

                                        <h3 className="
                                            font-medium
                                            text-foreground
                                        ">
                                            {activity.title}
                                        </h3>

                                        <Badge
                                            variant="outline"
                                            className="
                                                border-border
                                                text-muted-foreground
                                            "
                                        >
                                            {activity.type}
                                        </Badge>

                                    </div>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-muted-foreground
                                    ">
                                        {activity.description}
                                    </p>

                                    <p className="
                                        mt-2
                                        text-xs
                                        text-muted-foreground
                                    ">
                                        {activity.time}
                                    </p>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </CardContent>

        </Card>
    );
}

export default RecentActivity;