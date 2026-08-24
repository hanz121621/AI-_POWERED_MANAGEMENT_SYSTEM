import { motion } from "framer-motion";

import {
    UserPlus,
    Users,
    KeyRound,
    ShieldCheck
} from "lucide-react";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const actions = [
    {
        id: "USER-001",
        title: "Create User",
        description: "Create a new employee account in the system.",
        icon: UserPlus
    },
    {
        id: "USER-002",
        title: "Manage Users",
        description: "View, edit, activate, or deactivate users.",
        icon: Users
    },
    {
        id: "USER-003",
        title: "Assign Roles",
        description: "Assign system roles and access levels.",
        icon: KeyRound
    },
    {
        id: "USER-004",
        title: "Manage Permissions",
        description: "Control user permissions and security access.",
        icon: ShieldCheck
    }
];

function QuickActions() {
    const handleAction = (id) => {
        console.log(
            "Selected User Management Use Case:",
            id
        );

        // Future navigation:
        // USER-001 -> Create User Page
        // USER-002 -> User List Page
        // USER-003 -> Role Assignment Page
        // USER-004 -> Permission Management Page
    };

    return (
        <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
        ">

            {actions.map((action, index) => {

                const Icon = action.icon;

                return (
                    <motion.div
                        key={action.id}

                        initial={{
                            opacity: 0,
                            y: 20
                        }}

                        animate={{
                            opacity: 1,
                            y: 0
                        }}

                        transition={{
                            delay: index * 0.1
                        }}

                        whileHover={{
                            y: -6
                        }}
                    >

                        <Card className="
                            h-full
                            rounded-2xl
                            border
                            border-border
                            bg-card
                            text-card-foreground
                            shadow-sm
                            hover:shadow-xl
                            transition-all
                        ">

                            <CardContent className="
                                p-6
                                space-y-5
                            ">

                                {/* Icon */}

                                <div className="
                                    flex
                                    items-center
                                    justify-center
                                    w-14
                                    h-14
                                    rounded-xl
                                    bg-primary/10
                                ">

                                    <Icon
                                        className="
                                            w-7
                                            h-7
                                            text-primary
                                        "
                                    />

                                </div>

                                {/* Content */}

                                <div>

                                    <h3 className="
                                        text-lg
                                        font-semibold
                                        text-foreground
                                    ">
                                        {action.title}
                                    </h3>

                                    <p className="
                                        mt-2
                                        text-sm
                                        text-muted-foreground
                                    ">
                                        {action.description}
                                    </p>

                                </div>

                                {/* Action */}

                                <Button
                                    className="
                                        w-full
                                        rounded-xl
                                    "
                                    onClick={() =>
                                        handleAction(action.id)
                                    }
                                >
                                    Open
                                </Button>

                            </CardContent>

                        </Card>

                    </motion.div>
                );
            })}

        </div>
    );
}

export default QuickActions;