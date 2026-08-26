
import { useMemo, useState } from "react";

import {
    Search,
    Trash2,
    Eye,
    UserRound,
    Users,
    UserPlus,
    Layers3,
    Mail,
    Phone,
    CheckCircle2,
    XCircle,
    BriefcaseBusiness,
    FolderKanban,
    KeyRound,
    X,
} from "lucide-react";

/* =========================================================
   USER TABLE
========================================================= */

function UserTable({
    users = [],
    onDelete,
    onView,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [selectedContributorType, setSelectedContributorType] =
        useState("All");

    const [selectedUser, setSelectedUser] =
        useState(null);

    /* =====================================================
       CURRENT LOGGED-IN ADMIN
    ===================================================== */

    const currentUser = useMemo(() => {
        try {
            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    }, []);

    /* =====================================================
       NORMALIZE TEXT
    ===================================================== */

    const normalizeText = (value) => {
        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ");
    };

    /* =====================================================
       FORMAT NAME
    ===================================================== */

    const formatName = (value) => {
        if (!value) {
            return "Unknown User";
        }

        return String(value)
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .map((word) => {
                if (!word) {
                    return "";
                }

                return (
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
                );
            })
            .join(" ");
    };

    /* =====================================================
       GET USER ID
    ===================================================== */

    const getUserId = (user) => {
        return (
            user?.id ??
            user?.userId ??
            user?.Id ??
            user?.UserId ??
            ""
        );
    };

    /* =====================================================
       GET USER NAME
    ===================================================== */

    const getUserName = (user) => {
        return formatName(
            user?.fullName ??
            user?.FullName ??
            user?.name ??
            user?.Name ??
            user?.username ??
            user?.Username ??
            user?.displayName ??
            user?.DisplayName ??
            ""
        );
    };

    /* =====================================================
       GET EMAIL
    ===================================================== */

    const getEmail = (user) => {
        return (
            user?.email ??
            user?.Email ??
            user?.emailAddress ??
            user?.EmailAddress ??
            "No email"
        );
    };

    /* =====================================================
       GET PHONE
    ===================================================== */

    const getPhone = (user) => {
        return (
            user?.phoneNumber ??
            user?.PhoneNumber ??
            user?.phone ??
            user?.Phone ??
            ""
        );
    };

    /* =====================================================
       GET RAW ROLE

       BACKEND ENUM:

       Admin       = 1
       Manager     = 2
       Contributor = 3
    ===================================================== */

    const getRawRole = (user) => {
        return (
            user?.role ??
            user?.Role ??
            ""
        );
    };

    /* =====================================================
       GET ACCOUNT CATEGORY

       Backend:

       Role.Admin       = 1
       Role.Manager     = 2
       Role.Contributor = 3
    ===================================================== */

    const getAccountCategory = (user) => {
        const rawRole = getRawRole(user);

        const normalizedRole =
            normalizeText(rawRole);

        /* -------------------------------------------------
           ADMIN = 1
        ------------------------------------------------- */

        if (
            rawRole === 1 ||
            normalizedRole === "1" ||
            normalizedRole === "admin" ||
            normalizedRole === "administrator" ||
            normalizedRole === "system admin" ||
            normalizedRole ===
                "system administrator"
        ) {
            return "Admin";
        }

        /* -------------------------------------------------
           MANAGER = 2
        ------------------------------------------------- */

        if (
            rawRole === 2 ||
            normalizedRole === "2" ||
            normalizedRole === "manager" ||
            normalizedRole === "project manager" ||
            normalizedRole === "team manager"
        ) {
            return "Manager";
        }

        /* -------------------------------------------------
           CONTRIBUTOR = 3
        ------------------------------------------------- */

        if (
            rawRole === 3 ||
            normalizedRole === "3" ||
            normalizedRole === "contributor" ||
            normalizedRole === "contribution" ||
            normalizedRole === "team member"
        ) {
            return "Contributor";
        }

        /* -------------------------------------------------
           FALLBACK
        ------------------------------------------------- */

        return (
            user?.accountCategory ??
            user?.AccountCategory ??
            user?.category ??
            user?.Category ??
            ""
        );
    };

    /* =====================================================
       GET CONTRIBUTOR TYPE

       Backend:
       ContributorTypeName

       Examples:

       Team Leader
       Developer
       Staff
    ===================================================== */

    const getContributorType = (user) => {
        const value =
            user?.contributorTypeName ??
            user?.ContributorTypeName ??
            "";

        const normalized =
            normalizeText(value);

        if (
            normalized === "team leader" ||
            normalized === "teamlead" ||
            normalized === "leader"
        ) {
            return "Team Leader";
        }

        if (
            normalized === "developer" ||
            normalized === "dev"
        ) {
            return "Developer";
        }

        if (
            normalized === "staff" ||
            normalized === "staff member"
        ) {
            return "Staff";
        }

        return value
            ? String(value).trim()
            : "";
    };

    /* =====================================================
       GET CONTRIBUTOR SUBTYPE / SPECIALIZATION

       Backend:
       ContributorSubTypeName

       Example:

       ContributorTypeName:
       Developer

       ContributorSubTypeName:
       Frontend Developer
    ===================================================== */

    const getSpecialization = (user) => {
        const value =
            user?.contributorSubTypeName ??
            user?.ContributorSubTypeName ??
            "";

        return value
            ? String(value).trim()
            : "";
    };

    /* =====================================================
       GET TEAM
    ===================================================== */

    const getTeam = (user) => {
        return (
            user?.teamName ??
            user?.TeamName ??
            user?.team?.name ??
            user?.Team?.Name ??
            user?.team ??
            user?.Team ??
            user?.assignedTeamName ??
            user?.AssignedTeamName ??
            user?.assignedTeam?.name ??
            user?.AssignedTeam?.Name ??
            ""
        );
    };

    /* =====================================================
       GET PROJECT
    ===================================================== */

    const getProject = (user) => {
        return (
            user?.projectName ??
            user?.ProjectName ??
            user?.project?.name ??
            user?.Project?.Name ??
            user?.project ??
            user?.Project ??
            user?.assignedProjectName ??
            user?.AssignedProjectName ??
            user?.assignedProject?.name ??
            user?.AssignedProject?.Name ??
            ""
        );
    };

    /* =====================================================
       GET CURRENT WORK
    ===================================================== */

    const getCurrentWork = (user) => {
        const category =
            getAccountCategory(user);

        const contributorType =
            getContributorType(user);

        const specialization =
            getSpecialization(user);

        /* -------------------------------------------------
           CONTRIBUTOR
        ------------------------------------------------- */

        if (category === "Contributor") {
            if (
                contributorType &&
                specialization
            ) {
                return `${contributorType} — ${specialization}`;
            }

            if (contributorType) {
                return contributorType;
            }

            if (specialization) {
                return specialization;
            }

            return "Contributor";
        }

        /* -------------------------------------------------
           MANAGER
        ------------------------------------------------- */

        if (category === "Manager") {
            return "Project and Team Management";
        }

        /* -------------------------------------------------
           ADMIN
        ------------------------------------------------- */

        if (category === "Admin") {
            return "System Administration";
        }

        return "Not assigned";
    };

    /* =====================================================
       GET PERMISSIONS
    ===================================================== */

    const getPermissions = (user) => {
        if (
            Array.isArray(
                user?.permissions
            )
        ) {
            return user.permissions;
        }

        if (
            Array.isArray(
                user?.Permissions
            )
        ) {
            return user.Permissions;
        }

        if (
            user?.permissions &&
            typeof user.permissions ===
                "object"
        ) {
            return Object.entries(
                user.permissions
            )
                .filter(
                    ([, enabled]) =>
                        enabled
                )
                .map(
                    ([permission]) =>
                        permission
                );
        }

        if (
            user?.Permissions &&
            typeof user.Permissions ===
                "object"
        ) {
            return Object.entries(
                user.Permissions
            )
                .filter(
                    ([, enabled]) =>
                        enabled
                )
                .map(
                    ([permission]) =>
                        permission
                );
        }

        if (
            typeof user?.permissions ===
            "string"
        ) {
            return [user.permissions];
        }

        if (
            typeof user?.Permissions ===
            "string"
        ) {
            return [user.Permissions];
        }

        return [];
    };

    /* =====================================================
       USER STATUS

       Backend:
       IsActive = true / false
    ===================================================== */

    const isUserActive = (user) => {
        return !(
            user?.isActive === false ||
            user?.IsActive === false
        );
    };

    /* =====================================================
       CHECK CURRENT LOGGED-IN USER

       The admin should NOT see their own account.
    ===================================================== */

    const isCurrentUser = (user) => {
        if (!currentUser) {
            return false;
        }

        const currentId =
            currentUser?.id ??
            currentUser?.userId ??
            currentUser?.Id ??
            currentUser?.UserId;

        const currentEmail =
            currentUser?.email ??
            currentUser?.Email;

        const userId =
            getUserId(user);

        const userEmail =
            getEmail(user);

        /* -------------------------------------------------
           CHECK ID
        ------------------------------------------------- */

        if (
            currentId &&
            userId &&
            String(currentId)
                .toLowerCase() ===
                String(userId)
                    .toLowerCase()
        ) {
            return true;
        }

        /* -------------------------------------------------
           CHECK EMAIL
        ------------------------------------------------- */

        if (
            currentEmail &&
            userEmail &&
            String(currentEmail)
                .trim()
                .toLowerCase() ===
                String(userEmail)
                    .trim()
                    .toLowerCase()
        ) {
            return true;
        }

        return false;
    };

    /* =====================================================
       CATEGORY COUNTS

       Admin is NOT displayed.
    ===================================================== */

    const categoryCounts = useMemo(() => {
        const counts = {
            Manager: 0,
            Contributor: 0,
        };

        users.forEach((user) => {
            if (isCurrentUser(user)) {
                return;
            }

            const category =
                getAccountCategory(user);

            if (
                category === "Manager"
            ) {
                counts.Manager += 1;
            }

            if (
                category ===
                "Contributor"
            ) {
                counts.Contributor += 1;
            }
        });

        return counts;
    }, [users, currentUser]);

    /* =====================================================
       CONTRIBUTOR COUNTS
    ===================================================== */

    const contributorCounts =
        useMemo(() => {
            const counts = {
                "Team Leader": 0,
                Developer: 0,
                Staff: 0,
            };

            users.forEach((user) => {
                if (
                    isCurrentUser(
                        user
                    )
                ) {
                    return;
                }

                if (
                    getAccountCategory(
                        user
                    ) !==
                    "Contributor"
                ) {
                    return;
                }

                const type =
                    getContributorType(
                        user
                    );

                if (
                    type ===
                    "Team Leader"
                ) {
                    counts[
                        "Team Leader"
                    ] += 1;
                }

                if (
                    type ===
                    "Developer"
                ) {
                    counts.Developer += 1;
                }

                if (
                    type === "Staff"
                ) {
                    counts.Staff += 1;
                }
            });

            return counts;
        }, [users, currentUser]);

    /* =====================================================
       FILTER USERS
    ===================================================== */

    const filteredUsers = useMemo(() => {
        const search =
            normalizeText(
                searchTerm
            );

        return users.filter(
            (user) => {
                /* -----------------------------------------
                   HIDE CURRENT ADMIN
                ----------------------------------------- */

                if (
                    isCurrentUser(
                        user
                    )
                ) {
                    return false;
                }

                const category =
                    getAccountCategory(
                        user
                    );

                const contributorType =
                    getContributorType(
                        user
                    );

                /* -----------------------------------------
                   HIDE ADMIN ACCOUNTS
                ----------------------------------------- */

                if (
                    category === "Admin"
                ) {
                    return false;
                }

                /* -----------------------------------------
                   CATEGORY FILTER
                ----------------------------------------- */

                if (
                    selectedCategory !==
                        "All" &&
                    category !==
                        selectedCategory
                ) {
                    return false;
                }

                /* -----------------------------------------
                   CONTRIBUTOR TYPE FILTER
                ----------------------------------------- */

                if (
                    selectedCategory ===
                        "Contributor" &&
                    selectedContributorType !==
                        "All" &&
                    contributorType !==
                        selectedContributorType
                ) {
                    return false;
                }

                /* -----------------------------------------
                   SEARCH
                ----------------------------------------- */

                if (!search) {
                    return true;
                }

                const searchableValues =
                    [
                        getUserName(
                            user
                        ),

                        getEmail(
                            user
                        ),

                        getPhone(
                            user
                        ),

                        category,

                        contributorType,

                        getSpecialization(
                            user
                        ),

                        getTeam(
                            user
                        ),

                        getProject(
                            user
                        ),

                        getCurrentWork(
                            user
                        ),
                    ];

                return searchableValues.some(
                    (value) =>
                        normalizeText(
                            value
                        ).includes(
                            search
                        )
                );
            }
        );
    }, [
        users,
        selectedCategory,
        selectedContributorType,
        searchTerm,
        currentUser,
    ]);

    /* =====================================================
       CATEGORY BUTTON
    ===================================================== */

    const handleCategoryChange = (
        category
    ) => {
        setSelectedCategory(
            category
        );

        if (
            category !==
            "Contributor"
        ) {
            setSelectedContributorType(
                "All"
            );
        }
    };

    /* =====================================================
       VIEW USER
    ===================================================== */

    const handleViewUser = (
        user
    ) => {
        setSelectedUser(user);

        onView?.(user);
    };

    /* =====================================================
       CLOSE USER
    ===================================================== */

    const handleCloseUser = () => {
        setSelectedUser(null);
    };

    /* =====================================================
       CATEGORY STYLE
    ===================================================== */

    const getCategoryStyle = (
        category
    ) => {
        if (
            category === "Manager"
        ) {
            return `
                border-blue-200
                bg-blue-50
                text-blue-600
                dark:border-blue-500/20
                dark:bg-blue-500/10
                dark:text-blue-400
            `;
        }

        if (
            category ===
            "Contributor"
        ) {
            return `
                border-purple-200
                bg-purple-50
                text-purple-600
                dark:border-purple-500/20
                dark:bg-purple-500/10
                dark:text-purple-400
            `;
        }

        return `
            border-border
            bg-muted
            text-muted-foreground
        `;
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="w-full">

            {/* =================================================
                CATEGORY FILTERS
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* MANAGERS */}

                <button
                    type="button"
                    onClick={() =>
                        handleCategoryChange(
                            "Manager"
                        )
                    }
                    className={`
                        rounded-2xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-5
                        text-left
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                        dark:border-blue-500/20
                        dark:bg-blue-500/10
                        ${
                            selectedCategory ===
                            "Manager"
                                ? "ring-2 ring-blue-500/30"
                                : ""
                        }
                    `}
                >
                    <div className="flex items-center justify-between">

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-background/70
                            text-blue-600
                            dark:text-blue-400
                        ">
                            <Users size={21} />
                        </div>

                        <span className="
                            text-2xl
                            font-bold
                            text-blue-600
                            dark:text-blue-400
                        ">
                            {categoryCounts.Manager}
                        </span>

                    </div>

                    <p className="
                        mt-4
                        text-base
                        font-bold
                        text-blue-700
                        dark:text-blue-300
                    ">
                        Managers
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-blue-600/70
                        dark:text-blue-400/70
                    ">
                        Project and team managers
                    </p>

                </button>

                {/* CONTRIBUTORS */}

                <button
                    type="button"
                    onClick={() =>
                        handleCategoryChange(
                            "Contributor"
                        )
                    }
                    className={`
                        rounded-2xl
                        border
                        border-purple-200
                        bg-purple-50
                        p-5
                        text-left
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                        dark:border-purple-500/20
                        dark:bg-purple-500/10
                        ${
                            selectedCategory ===
                            "Contributor"
                                ? "ring-2 ring-purple-500/30"
                                : ""
                        }
                    `}
                >
                    <div className="flex items-center justify-between">

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-background/70
                            text-purple-600
                            dark:text-purple-400
                        ">
                            <UserPlus size={21} />
                        </div>

                        <span className="
                            text-2xl
                            font-bold
                            text-purple-600
                            dark:text-purple-400
                        ">
                            {categoryCounts.Contributor}
                        </span>

                    </div>

                    <p className="
                        mt-4
                        text-base
                        font-bold
                        text-purple-700
                        dark:text-purple-300
                    ">
                        Contributors
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-purple-600/70
                        dark:text-purple-400/70
                    ">
                        Team Leaders, Developers and Staff
                    </p>

                </button>

            </div>

            {/* =================================================
                CONTRIBUTOR TYPES
            ================================================= */}

            {selectedCategory ===
                "Contributor" && (
                <div className="
                    mb-6
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-4
                ">

                    <div className="
                        mb-4
                        flex
                        items-center
                        gap-2
                    ">
                        <Layers3
                            size={18}
                            className="text-primary"
                        />

                        <h3 className="
                            text-sm
                            font-semibold
                            text-foreground
                        ">
                            Contributor Type
                        </h3>

                    </div>

                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-4
                    ">

                        {/* ALL */}

                        <button
                            type="button"
                            onClick={() =>
                                setSelectedContributorType(
                                    "All"
                                )
                            }
                            className={`
                                rounded-xl
                                border
                                px-4
                                py-4
                                text-left
                                transition
                                ${
                                    selectedContributorType ===
                                    "All"
                                        ? "border-primary/30 bg-primary/10"
                                        : "border-border bg-background hover:bg-muted"
                                }
                            `}
                        >
                            <p className="
                                text-xs
                                text-muted-foreground
                            ">
                                All Contributors
                            </p>

                            <p className="
                                mt-1
                                text-xl
                                font-bold
                                text-foreground
                            ">
                                {
                                    categoryCounts.Contributor
                                }
                            </p>

                        </button>

                        {/* TEAM LEADER */}

                        <ContributorFilter
                            label="Team Leader"
                            count={
                                contributorCounts[
                                    "Team Leader"
                                ]
                            }
                            selected={
                                selectedContributorType ===
                                "Team Leader"
                            }
                            onClick={() =>
                                setSelectedContributorType(
                                    "Team Leader"
                                )
                            }
                        />

                        {/* DEVELOPER */}

                        <ContributorFilter
                            label="Developer"
                            count={
                                contributorCounts.Developer
                            }
                            selected={
                                selectedContributorType ===
                                "Developer"
                            }
                            onClick={() =>
                                setSelectedContributorType(
                                    "Developer"
                                )
                            }
                        />

                        {/* STAFF */}

                        <ContributorFilter
                            label="Staff"
                            count={
                                contributorCounts.Staff
                            }
                            selected={
                                selectedContributorType ===
                                "Staff"
                            }
                            onClick={() =>
                                setSelectedContributorType(
                                    "Staff"
                                )
                            }
                        />

                    </div>
                </div>
            )}

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                mb-5
                flex
                flex-col
                gap-3
                md:flex-row
                md:items-center
                md:justify-between
            ">

                <div>

                    <h2 className="
                        text-xl
                        font-bold
                        text-foreground
                    ">
                        {selectedCategory ===
                        "All"
                            ? "Users"
                            : selectedCategory ===
                              "Contributor"
                            ? selectedContributorType ===
                              "All"
                                ? "Contributors"
                                : selectedContributorType
                            : "Managers"}
                    </h2>

                    <p className="
                        mt-1
                        text-sm
                        text-muted-foreground
                    ">
                        {selectedCategory ===
                        "Contributor"
                            ? selectedContributorType ===
                              "All"
                                ? "View Team Leaders, Developers and Staff."
                                : `Viewing ${selectedContributorType}s.`
                            : selectedCategory ===
                              "Manager"
                            ? "View project and team managers."
                            : "View system users."}
                    </p>

                </div>

                {selectedCategory !==
                    "All" && (
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCategory(
                                "All"
                            );

                            setSelectedContributorType(
                                "All"
                            );
                        }}
                        className="
                            self-start
                            rounded-lg
                            border
                            border-border
                            bg-background
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-muted-foreground
                            transition
                            hover:bg-muted
                            hover:text-foreground
                        "
                    >
                        View All Users
                    </button>
                )}

            </div>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="mb-6">

                <div className="
                    relative
                    w-full
                    max-w-xl
                ">

                    <Search
                        size={18}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-muted-foreground
                        "
                    />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder="
                            Search by name, email, phone,
                            category, contributor type,
                            subtype, team or project...
                        "
                        className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-input
                            bg-background
                            pl-10
                            pr-4
                            text-sm
                            text-foreground
                            outline-none
                            placeholder:text-muted-foreground
                            focus:border-primary
                            focus:ring-2
                            focus:ring-primary/20
                        "
                    />

                </div>

            </div>

            {/* =================================================
                USER TABLE
            ================================================= */}

            {filteredUsers.length >
            0 ? (

                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    shadow-sm
                ">

                    <div className="overflow-x-auto">

                        <table className="
                            w-full
                            min-w-[950px]
                            border-collapse
                        ">

                            {/* HEADER */}

                            <thead className="
                                bg-muted/40
                            ">

                                <tr className="
                                    border-b
                                    border-border
                                ">

                                    <th className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    ">
                                        Name
                                    </th>

                                    <th className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    ">
                                        Email
                                    </th>

                                    <th className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    ">
                                        Phone
                                    </th>

                                    <th className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    ">
                                        Category
                                    </th>

                                    <th className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    ">
                                        Specialization
                                    </th>

                                    <th className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    ">
                                        Status
                                    </th>

                                    <th className="
                                        px-5
                                        py-4
                                        text-right
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-muted-foreground
                                    ">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            {/* BODY */}

                            <tbody>

                                {filteredUsers.map(
                                    (user) => {
                                        const category =
                                            getAccountCategory(
                                                user
                                            );

                                        const contributorType =
                                            getContributorType(
                                                user
                                            );

                                        const specialization =
                                            getSpecialization(
                                                user
                                            );

                                        const active =
                                            isUserActive(
                                                user
                                            );

                                        return (
                                            <tr
                                                key={
                                                    getUserId(
                                                        user
                                                    ) ||
                                                    getEmail(
                                                        user
                                                    )
                                                }
                                                className="
                                                    border-b
                                                    border-border
                                                    transition
                                                    hover:bg-muted/30
                                                "
                                            >

                                                {/* NAME */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewUser(
                                                                user
                                                            )
                                                        }
                                                        className="
                                                            group
                                                            flex
                                                            items-center
                                                            gap-3
                                                            text-left
                                                        "
                                                    >

                                                        <div className="
                                                            flex
                                                            h-10
                                                            w-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            bg-primary/10
                                                            text-primary
                                                        ">
                                                            <UserRound
                                                                size={
                                                                    18
                                                                }
                                                            />
                                                        </div>

                                                        <div>

                                                            <p className="
                                                                font-semibold
                                                                text-foreground
                                                                underline-offset-4
                                                                group-hover:text-primary
                                                                group-hover:underline
                                                            ">
                                                                {getUserName(
                                                                    user
                                                                )}
                                                            </p>

                                                            <p className="
                                                                mt-0.5
                                                                text-xs
                                                                text-muted-foreground
                                                            ">
                                                                Click to view details
                                                            </p>

                                                        </div>

                                                    </button>

                                                </td>

                                                {/* EMAIL */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-sm
                                                        text-foreground
                                                    ">

                                                        <Mail
                                                            size={
                                                                14
                                                            }
                                                            className="
                                                                text-muted-foreground
                                                            "
                                                        />

                                                        {
                                                            getEmail(
                                                                user
                                                            )
                                                        }

                                                    </div>

                                                </td>

                                                {/* PHONE */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-sm
                                                        text-foreground
                                                    ">

                                                        <Phone
                                                            size={
                                                                14
                                                            }
                                                            className="
                                                                text-muted-foreground
                                                            "
                                                        />

                                                        {getPhone(
                                                            user
                                                        ) ||
                                                            "Not provided"}

                                                    </div>

                                                </td>

                                                {/* CATEGORY */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            rounded-full
                                                            border
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-semibold
                                                            ${getCategoryStyle(
                                                                category
                                                            )}
                                                        `}
                                                    >
                                                        {
                                                            category
                                                        }
                                                    </span>

                                                </td>

                                                {/* SPECIALIZATION */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        max-w-[220px]
                                                    ">

                                                        <p className="
                                                            truncate
                                                            text-sm
                                                            font-medium
                                                            text-foreground
                                                        ">
                                                            {specialization ||
                                                                contributorType ||
                                                                "Not assigned"}
                                                        </p>

                                                        {category ===
                                                            "Contributor" &&
                                                            contributorType &&
                                                            specialization && (
                                                                <p className="
                                                                    mt-0.5
                                                                    truncate
                                                                    text-xs
                                                                    text-muted-foreground
                                                                ">
                                                                    {
                                                                        contributorType
                                                                    }
                                                                </p>
                                                            )}

                                                    </div>

                                                </td>

                                                {/* STATUS */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    {active ? (
                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            border
                                                            border-emerald-500/30
                                                            bg-emerald-500/10
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-semibold
                                                            text-emerald-600
                                                            dark:text-emerald-400
                                                        ">

                                                            <CheckCircle2
                                                                size={
                                                                    13
                                                                }
                                                            />

                                                            Active

                                                        </span>
                                                    ) : (
                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            border
                                                            border-red-500/30
                                                            bg-red-500/10
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-semibold
                                                            text-red-600
                                                            dark:text-red-400
                                                        ">

                                                            <XCircle
                                                                size={
                                                                    13
                                                                }
                                                            />

                                                            Inactive

                                                        </span>
                                                    )}

                                                </td>

                                                {/* ACTIONS */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        justify-end
                                                        gap-2
                                                    ">

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewUser(
                                                                    user
                                                                )
                                                            }
                                                            title="View User"
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                rounded-lg
                                                                border
                                                                border-border
                                                                bg-background
                                                                px-3
                                                                py-2
                                                                text-xs
                                                                font-semibold
                                                                text-muted-foreground
                                                                transition
                                                                hover:border-primary/30
                                                                hover:bg-primary/10
                                                                hover:text-primary
                                                            "
                                                        >

                                                            <Eye
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            View

                                                        </button>

                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onDelete?.(
                                                                    user
                                                                )
                                                            }
                                                            title="Delete User"
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                rounded-lg
                                                                border
                                                                border-border
                                                                bg-background
                                                                px-3
                                                                py-2
                                                                text-xs
                                                                font-semibold
                                                                text-muted-foreground
                                                                transition
                                                                hover:border-red-500/30
                                                                hover:bg-red-500/10
                                                                hover:text-red-600
                                                                dark:hover:text-red-400
                                                            "
                                                        >

                                                            <Trash2
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            Delete

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            ) : (

                <div className="
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    px-5
                    py-16
                    text-center
                ">

                    <Users
                        size={42}
                        className="
                            mx-auto
                            mb-3
                            text-muted-foreground
                        "
                    />

                    <p className="
                        text-sm
                        font-semibold
                        text-foreground
                    ">
                        {searchTerm
                            ? "No matching users found"
                            : selectedCategory ===
                              "Contributor" &&
                              selectedContributorType !==
                                  "All"
                            ? `No ${selectedContributorType.toLowerCase()} contributors found`
                            : selectedCategory ===
                              "Manager"
                            ? "No managers found"
                            : "No users found"}
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-muted-foreground
                    ">
                        Try another filter or search term.
                    </p>

                </div>
            )}

            {/* =================================================
                RESULT COUNT
            ================================================= */}

            <div className="
                mt-4
                flex
                items-center
                justify-between
                text-xs
                text-muted-foreground
            ">

                <span>
                    Showing{" "}
                    <span className="
                        font-semibold
                        text-foreground
                    ">
                        {
                            filteredUsers.length
                        }
                    </span>{" "}
                    users
                </span>

            </div>

            {/* =================================================
                USER DETAILS MODAL
            ================================================= */}

            {selectedUser && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        p-4
                        backdrop-blur-sm
                    "
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseUser();
                        }
                    }}
                >

                    <div className="
                        relative
                        max-h-[90vh]
                        w-full
                        max-w-3xl
                        overflow-y-auto
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        shadow-2xl
                    ">

                        {/* HEADER */}

                        <div className="
                            sticky
                            top-0
                            z-10
                            flex
                            items-center
                            justify-between
                            border-b
                            border-border
                            bg-card
                            px-6
                            py-5
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-primary/10
                                    text-primary
                                ">
                                    <UserRound size={22} />
                                </div>

                                <div>

                                    <h3 className="
                                        text-lg
                                        font-bold
                                        text-foreground
                                    ">
                                        {
                                            getUserName(
                                                selectedUser
                                            )
                                        }
                                    </h3>

                                    <p className="
                                        text-sm
                                        text-muted-foreground
                                    ">
                                        {
                                            getAccountCategory(
                                                selectedUser
                                            )
                                        }
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseUser
                                }
                                title="Close"
                                className="
                                    rounded-lg
                                    p-2
                                    text-muted-foreground
                                    transition
                                    hover:bg-muted
                                    hover:text-foreground
                                "
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* CONTENT */}

                        <div className="
                            space-y-6
                            p-6
                        ">

                            {/* BASIC INFORMATION */}

                            <section>

                                <h4 className="
                                    mb-3
                                    text-sm
                                    font-bold
                                    text-foreground
                                ">
                                    User Information
                                </h4>

                                <div className="
                                    grid
                                    grid-cols-1
                                    gap-3
                                    md:grid-cols-2
                                ">

                                    <InfoCard
                                        icon={
                                            <UserRound
                                                size={14}
                                            />
                                        }
                                        label="Name"
                                        value={getUserName(
                                            selectedUser
                                        )}
                                    />

                                    <InfoCard
                                        icon={
                                            <Mail
                                                size={14}
                                            />
                                        }
                                        label="Email"
                                        value={getEmail(
                                            selectedUser
                                        )}
                                    />

                                    <InfoCard
                                        icon={
                                            <Phone
                                                size={14}
                                            />
                                        }
                                        label="Phone"
                                        value={
                                            getPhone(
                                                selectedUser
                                            ) ||
                                            "Not provided"
                                        }
                                    />

                                    <InfoCard
                                        label="Category"
                                        value={
                                            getAccountCategory(
                                                selectedUser
                                            ) ||
                                            "Not assigned"
                                        }
                                    />

                                </div>

                            </section>

                            {/* WHAT THEY ARE DOING */}

                            <section>

                                <h4 className="
                                    mb-3
                                    text-sm
                                    font-bold
                                    text-foreground
                                ">
                                    What They Are Doing
                                </h4>

                                <div className="
                                    rounded-xl
                                    border
                                    border-primary/20
                                    bg-primary/5
                                    p-5
                                ">

                                    <p className="
                                        text-xs
                                        text-muted-foreground
                                    ">
                                        Current Role / Work
                                    </p>

                                    <p className="
                                        mt-2
                                        text-base
                                        font-bold
                                        text-foreground
                                    ">
                                        {
                                            getCurrentWork(
                                                selectedUser
                                            )
                                        }
                                    </p>

                                    {getAccountCategory(
                                        selectedUser
                                    ) ===
                                        "Contributor" && (
                                        <div className="
                                            mt-4
                                            grid
                                            grid-cols-1
                                            gap-4
                                            md:grid-cols-2
                                        ">

                                            <StructureItem
                                                label="Contributor Type"
                                                value={
                                                    getContributorType(
                                                        selectedUser
                                                    ) ||
                                                    "Not assigned"
                                                }
                                            />

                                            <StructureItem
                                                label="Contributor Subtype"
                                                value={
                                                    getSpecialization(
                                                        selectedUser
                                                    ) ||
                                                    "Not assigned"
                                                }
                                            />

                                        </div>
                                    )}

                                </div>

                            </section>

                            {/* ASSIGNMENTS */}

                            <section>

                                <h4 className="
                                    mb-3
                                    text-sm
                                    font-bold
                                    text-foreground
                                ">
                                    Assignments
                                </h4>

                                <div className="
                                    grid
                                    grid-cols-1
                                    gap-3
                                    md:grid-cols-2
                                ">

                                    <InfoCard
                                        icon={
                                            <BriefcaseBusiness
                                                size={14}
                                            />
                                        }
                                        label="Assigned Team"
                                        value={
                                            getTeam(
                                                selectedUser
                                            ) ||
                                            "Not assigned"
                                        }
                                    />

                                    <InfoCard
                                        icon={
                                            <FolderKanban
                                                size={14}
                                            />
                                        }
                                        label="Assigned Project"
                                        value={
                                            getProject(
                                                selectedUser
                                            ) ||
                                            "Not assigned"
                                        }
                                    />

                                </div>

                            </section>

                            {/* PERMISSIONS */}

                            <section>

                                <h4 className="
                                    mb-3
                                    text-sm
                                    font-bold
                                    text-foreground
                                ">
                                    Permissions
                                </h4>

                                {getPermissions(
                                    selectedUser
                                ).length >
                                0 ? (
                                    <div className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    ">

                                        {getPermissions(
                                            selectedUser
                                        ).map(
                                            (
                                                permission,
                                                index
                                            ) => (
                                                <span
                                                    key={`${permission}-${index}`}
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        border
                                                        border-indigo-200
                                                        bg-indigo-50
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        text-indigo-600
                                                        dark:border-indigo-500/20
                                                        dark:bg-indigo-500/10
                                                        dark:text-indigo-400
                                                    "
                                                >

                                                    <KeyRound
                                                        size={
                                                            12
                                                        }
                                                    />

                                                    {
                                                        permission
                                                    }

                                                </span>
                                            )
                                        )}

                                    </div>
                                ) : (
                                    <p className="
                                        text-sm
                                        text-muted-foreground
                                    ">
                                        No permissions configured.
                                    </p>
                                )}

                            </section>

                            {/* STATUS */}

                            <section>

                                <h4 className="
                                    mb-3
                                    text-sm
                                    font-bold
                                    text-foreground
                                ">
                                    Account Status
                                </h4>

                                {isUserActive(
                                    selectedUser
                                ) ? (
                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-emerald-500/30
                                        bg-emerald-500/10
                                        p-4
                                        text-emerald-600
                                        dark:text-emerald-400
                                    ">

                                        <CheckCircle2
                                            size={20}
                                        />

                                        <div>

                                            <p className="
                                                text-sm
                                                font-bold
                                            ">
                                                Active Account
                                            </p>

                                            <p className="
                                                text-xs
                                                opacity-80
                                            ">
                                                This user can access their permitted system features.
                                            </p>

                                        </div>

                                    </div>
                                ) : (
                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-red-500/30
                                        bg-red-500/10
                                        p-4
                                        text-red-600
                                        dark:text-red-400
                                    ">

                                        <XCircle
                                            size={20}
                                        />

                                        <div>

                                            <p className="
                                                text-sm
                                                font-bold
                                            ">
                                                Inactive Account
                                            </p>

                                            <p className="
                                                text-xs
                                                opacity-80
                                            ">
                                                This account currently has no effective access.
                                            </p>

                                        </div>

                                    </div>
                                )}

                            </section>

                        </div>

                        {/* FOOTER */}

                        <div className="
                            flex
                            justify-end
                            border-t
                            border-border
                            bg-muted/30
                            px-6
                            py-4
                        ">

                            <button
                                type="button"
                                onClick={
                                    handleCloseUser
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-border
                                    bg-background
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-foreground
                                    transition
                                    hover:bg-muted
                                "
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

/* =========================================================
   CONTRIBUTOR FILTER
========================================================= */

function ContributorFilter({
    label,
    count,
    selected,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                rounded-xl
                border
                px-4
                py-4
                text-left
                transition
                ${
                    selected
                        ? "border-primary/30 bg-primary/10"
                        : "border-border bg-background hover:bg-muted"
                }
            `}
        >

            <p className="
                text-xs
                text-muted-foreground
            ">
                {label}
            </p>

            <p className="
                mt-1
                text-xl
                font-bold
                text-foreground
            ">
                {count}
            </p>

        </button>
    );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="
            rounded-xl
            border
            border-border
            bg-background
            p-4
        ">

            <div className="
                mb-1
                flex
                items-center
                gap-2
                text-xs
                text-muted-foreground
            ">
                {icon}
                {label}
            </div>

            <p className="
                break-words
                text-sm
                font-semibold
                text-foreground
            ">
                {value}
            </p>

        </div>
    );
}

/* =========================================================
   STRUCTURE ITEM
========================================================= */

function StructureItem({
    label,
    value,
}) {
    return (
        <div>

            <p className="
                text-xs
                text-muted-foreground
            ">
                {label}
            </p>

            <p className="
                mt-1
                break-words
                text-sm
                font-bold
                text-foreground
            ">
                {value}
            </p>

        </div>
    );
}

export default UserTable;
