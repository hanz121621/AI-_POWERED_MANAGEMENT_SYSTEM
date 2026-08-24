
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Search,
    Users,
    UserPlus,
    CheckCircle2,
    AlertTriangle,
    UserRound,
    KeyRound,
    UserCog,
} from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import UserTable from "@/components/admin/users/UserTable";
import CreateUserDialog from "@/components/admin/users/CreateUserDialog";
import EditUserDialog from "@/components/admin/users/EditUserDialog";
import ManagePermissions from "@/components/admin/users/ManagePermissions";

import {
    getUsers,
    createUser,
    editUser,
    removeUser,
    changeUserStatus,
    normalizeUserRole,
} from "@/services/authService";

/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
    roles: "roles",
    permissions: "permissions",
    contributorTypes: "contributorTypes",
    contributorSubtypes: "contributorSubtypes",
    organizations: "organizations",
    departments: "departments",
    teams: "teams",
    activityLogs: "activityLogs",
    notifications: "notifications",
};

/* =========================================================
   FALLBACK ROLES
========================================================= */

const FALLBACK_ROLES = [
    {
        id: "admin",
        name: "Admin",
        category: "Admin",
        permissionIds: [
            "manage_users",
            "assign_roles",
            "manage_permissions",
            "manage_projects",
            "manage_tasks",
            "manage_sprints",
            "view_reports",
            "manage_departments",
            "view_ai_suggestions",
            "view_risk_analysis",
        ],
        enabled: true,
    },

    {
        id: "manager",
        name: "Manager",
        category: "Manager",
        permissionIds: [
            "manage_projects",
            "manage_tasks",
            "manage_sprints",
            "view_reports",
            "view_ai_suggestions",
            "view_risk_analysis",
        ],
        enabled: true,
    },

    {
        id: "contributor",
        name: "Contributor",
        category: "Contributor",
        permissionIds: [
            "view_reports",
            "manage_tasks",
            "view_ai_suggestions",
        ],
        enabled: true,
    },
];

/* =========================================================
   FALLBACK PERMISSIONS
========================================================= */

const FALLBACK_PERMISSIONS = [
    {
        id: "manage_users",
        label: "Manage Users",
        description:
            "Create, update, activate, deactivate and delete users.",
        enabled: true,
    },

    {
        id: "assign_roles",
        label: "Assign Roles",
        description:
            "Assign configured roles to users.",
        enabled: true,
    },

    {
        id: "manage_permissions",
        label: "Manage Permissions",
        description:
            "Configure role and user permissions.",
        enabled: true,
    },

    {
        id: "manage_projects",
        label: "Manage Projects",
        description:
            "Create and manage projects.",
        enabled: true,
    },

    {
        id: "manage_tasks",
        label: "Manage Tasks",
        description:
            "Create, update and manage tasks.",
        enabled: true,
    },

    {
        id: "manage_sprints",
        label: "Manage Sprints",
        description:
            "Create and manage project sprints.",
        enabled: true,
    },

    {
        id: "view_reports",
        label: "View Reports",
        description:
            "View project and performance reports.",
        enabled: true,
    },

    {
        id: "manage_departments",
        label: "Manage Departments",
        description:
            "Create and manage departments.",
        enabled: true,
    },

    {
        id: "view_ai_suggestions",
        label: "View AI Suggestions",
        description:
            "Access AI-powered suggestions.",
        enabled: true,
    },

    {
        id: "view_risk_analysis",
        label: "View Risk Analysis",
        description:
            "View AI-powered project risk analysis.",
        enabled: true,
    },
];

/* =========================================================
   FALLBACK CONTRIBUTOR TYPES
========================================================= */

const FALLBACK_CONTRIBUTOR_TYPES = [
    {
        id: "team_leader",
        name: "Team Leader",
        enabled: true,
    },

    {
        id: "staff",
        name: "Staff",
        enabled: true,
    },

    {
        id: "developer",
        name: "Developer",
        enabled: true,
    },
];

/* =========================================================
   FALLBACK CONTRIBUTOR SUBTYPES
========================================================= */

const FALLBACK_CONTRIBUTOR_SUBTYPES = [
    {
        id: "frontend_developer",
        name: "Frontend Developer",
        contributorType: "Developer",
        enabled: true,
    },

    {
        id: "backend_developer",
        name: "Backend Developer",
        contributorType: "Developer",
        enabled: true,
    },

    {
        id: "full_stack_developer",
        name: "Full-Stack Developer",
        contributorType: "Developer",
        enabled: true,
    },

    {
        id: "ui_ux_designer",
        name: "UI/UX Designer",
        contributorType: "Developer",
        enabled: true,
    },

    {
        id: "qa_tester",
        name: "QA / Tester",
        contributorType: "Developer",
        enabled: true,
    },

    {
        id: "devops_developer",
        name: "DevOps Developer",
        contributorType: "Developer",
        enabled: true,
    },

    {
        id: "mobile_developer",
        name: "Mobile Developer",
        contributorType: "Developer",
        enabled: true,
    },

    {
        id: "documentation_specialist",
        name: "Documentation Specialist",
        contributorType: "Staff",
        enabled: true,
    },

    {
        id: "business_analyst",
        name: "Business Analyst",
        contributorType: "Staff",
        enabled: true,
    },

    {
        id: "project_coordinator",
        name: "Project Coordinator",
        contributorType: "Staff",
        enabled: true,
    },

    {
        id: "data_entry_assistant",
        name: "Data Entry Assistant",
        contributorType: "Staff",
        enabled: true,
    },

    {
        id: "administrative_assistant",
        name: "Administrative Assistant",
        contributorType: "Staff",
        enabled: true,
    },

    {
        id: "other",
        name: "Other",
        contributorType: "Staff",
        enabled: true,
    },

    {
        id: "other_developer",
        name: "Other",
        contributorType: "Developer",
        enabled: true,
    },
];

/* =========================================================
   HELPERS
========================================================= */

function readArray(key) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return [];
        }

        const parsed = JSON.parse(value);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            `Unable to read ${key}:`,
            error
        );

        return [];
    }
}

function writeArray(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;
    } catch (error) {
        console.error(
            `Unable to save ${key}:`,
            error
        );

        return false;
    }
}

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
}

/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {
    try {
        const stored =
            localStorage.getItem(
                "currentUser"
            ) ||
            localStorage.getItem(
                "user"
            );

        if (!stored) {
            return null;
        }

        return JSON.parse(stored);
    } catch (error) {
        console.error(
            "Unable to read current user:",
            error
        );

        return null;
    }
}

/* =========================================================
   ID
========================================================= */

function createId(prefix = "id") {
    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {
        return crypto.randomUUID();
    }

    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}

/* =========================================================
   CONFIGURATION
========================================================= */

function getConfiguredRoles() {
    const stored = readArray(
        STORAGE_KEYS.roles
    );

    if (!stored.length) {
        return FALLBACK_ROLES;
    }

    return stored
        .map((role) => {
            if (typeof role === "string") {
                return {
                    id: normalize(role).replace(
                        /\s+/g,
                        "_"
                    ),
                    name: role,
                    category: role,
                    permissionIds: [],
                    enabled: true,
                };
            }

            return {
                ...role,

                id:
                    role.id ??
                    role.roleId ??
                    role.name,

                name:
                    role.name ??
                    role.label ??
                    role.role ??
                    "",

                category:
                    role.category ??
                    role.roleCategory ??
                    role.accountCategory ??
                    role.type ??
                    role.name ??
                    "",

                permissionIds:
                    Array.isArray(
                        role.permissionIds
                    )
                        ? role.permissionIds
                        : Array.isArray(
                            role.permissions
                        )
                            ? role.permissions
                            : [],

                enabled:
                    role.enabled !== false &&
                    role.isActive !== false,
            };
        })
        .filter(
            (role) =>
                role.name &&
                role.enabled
        );
}

function getConfiguredPermissions() {
    const stored = readArray(
        STORAGE_KEYS.permissions
    );

    if (!stored.length) {
        return FALLBACK_PERMISSIONS;
    }

    return stored
        .map((permission) => {
            if (
                typeof permission ===
                "string"
            ) {
                return {
                    id: permission,
                    label: permission,
                    description: "",
                    enabled: true,
                };
            }

            return {
                ...permission,

                id:
                    permission.id ??
                    permission.permissionId ??
                    permission.name,

                label:
                    permission.label ??
                    permission.name ??
                    permission.id,

                description:
                    permission.description ??
                    "",

                enabled:
                    permission.enabled !== false &&
                    permission.isActive !== false,
            };
        })
        .filter(
            (permission) =>
                permission.id &&
                permission.enabled
        );
}

function getConfiguredContributorTypes() {
    const stored = readArray(
        STORAGE_KEYS.contributorTypes
    );

    if (!stored.length) {
        return FALLBACK_CONTRIBUTOR_TYPES;
    }

    return stored
        .map((item) => {
            if (typeof item === "string") {
                return {
                    id: normalize(item).replace(
                        /\s+/g,
                        "_"
                    ),
                    name: item,
                    enabled: true,
                };
            }

            return {
                ...item,

                id:
                    item.id ??
                    item.contributorTypeId ??
                    item.name ??
                    item.value,

                name:
                    item.name ??
                    item.label ??
                    item.value ??
                    "",

                enabled:
                    item.enabled !== false &&
                    item.isActive !== false,
            };
        })
        .filter(
            (item) =>
                item.name &&
                item.enabled
        );
}

function getConfiguredContributorSubtypes() {
    const stored = readArray(
        STORAGE_KEYS.contributorSubtypes
    );

    if (!stored.length) {
        return FALLBACK_CONTRIBUTOR_SUBTYPES;
    }

    return stored
        .map((item) => {
            if (typeof item === "string") {
                return {
                    id: normalize(item).replace(
                        /\s+/g,
                        "_"
                    ),
                    name: item,
                    contributorType: "",
                    enabled: true,
                };
            }

            return {
                ...item,

                id:
                    item.id ??
                    item.subtypeId ??
                    item.contributorSubtypeId ??
                    item.name ??
                    item.value,

                name:
                    item.name ??
                    item.label ??
                    item.value ??
                    "",

                contributorType:
                    item.contributorType ??
                    item.type ??
                    item.category ??
                    "",

                enabled:
                    item.enabled !== false &&
                    item.isActive !== false,
            };
        })
        .filter(
            (item) =>
                item.name &&
                item.enabled
        );
}

function getConfiguredOrganizations() {
    return readArray(
        STORAGE_KEYS.organizations
    );
}

function getConfiguredDepartments() {
    return readArray(
        STORAGE_KEYS.departments
    );
}

function getConfiguredTeams() {
    return readArray(
        STORAGE_KEYS.teams
    );
}

/* =========================================================
   AUDIT LOG
========================================================= */

function addAuditLog(
    action,
    user,
    details
) {
    const logs = readArray(
        STORAGE_KEYS.activityLogs
    );

    const currentUser =
        getCurrentUser();

    logs.unshift({
        id: createId("log"),

        action,

        details,

        targetUserId:
            user?.id ??
            user?.userId ??
            null,

        targetUserName:
            user?.fullName ??
            user?.name ??
            "",

        performedBy:
            currentUser?.fullName ??
            currentUser?.name ??
            currentUser?.email ??
            "Admin",

        performedByUserId:
            currentUser?.id ??
            currentUser?.userId ??
            null,

        createdAt:
            new Date().toISOString(),
    });

    writeArray(
        STORAGE_KEYS.activityLogs,
        logs
    );
}

/* =========================================================
   NOTIFICATION
========================================================= */

function addNotification(
    user,
    message
) {
    const notifications =
        readArray(
            STORAGE_KEYS.notifications
        );

    notifications.unshift({
        id: createId(
            "notification"
        ),

        userId:
            user?.id ??
            user?.userId ??
            null,

        email:
            user?.email ??
            "",

        message,

        read: false,

        createdAt:
            new Date().toISOString(),
    });

    writeArray(
        STORAGE_KEYS.notifications,
        notifications
    );
}

/* =========================================================
   ROLE PERMISSIONS
========================================================= */

function getConfiguredRolePermissionIds(
    role,
    permissions
) {
    if (!role) {
        return [];
    }

    let configured =
        role.permissionIds ??
        role.permissions ??
        [];

    if (
        !Array.isArray(configured) &&
        configured &&
        typeof configured === "object"
    ) {
        configured =
            Object.entries(
                configured
            )
                .filter(
                    ([, enabled]) =>
                        enabled === true
                )
                .map(
                    ([id]) => id
                );
    }

    if (!Array.isArray(configured)) {
        return [];
    }

    return permissions
        .filter(
            (permission) =>
                permission.enabled !== false
        )
        .filter(
            (permission) =>
                configured.includes(
                    permission.id
                )
        )
        .map(
            (permission) =>
                permission.id
        );
}

function getEffectivePermissionIds(
    role,
    permissions,
    selectedPermissionIds = []
) {
    if (!role) {
        return [];
    }

    const roleName = normalize(
        role.name ??
        role.category ??
        ""
    );

    if (roleName === "admin") {
        return permissions
            .filter(
                (permission) =>
                    permission.enabled !== false
            )
            .map(
                (permission) =>
                    permission.id
            );
    }

    if (roleName === "manager") {
        const selected =
            Array.isArray(
                selectedPermissionIds
            )
                ? selectedPermissionIds
                : [];

        return permissions
            .filter(
                (permission) =>
                    permission.enabled !== false &&
                    selected.includes(
                        permission.id
                    )
            )
            .map(
                (permission) =>
                    permission.id
            );
    }

    return getConfiguredRolePermissionIds(
        role,
        permissions
    );
}

/* =========================================================
   API USER NORMALIZATION
========================================================= */

function normalizeApiUser(user) {
    if (!user) {
        return null;
    }

    const normalizedRole =
        normalizeUserRole(
            user.role
        );

    const isActive =
        user.isActive !== false;

    return {
        ...user,

        id:
            user.id ??
            user.userId ??
            user.Id ??
            user.UserId,

        userId:
            user.userId ??
            user.id ??
            user.Id ??
            user.UserId,

        fullName:
            user.fullName ??
            user.name ??
            user.userName ??
            user.username ??
            "",

        name:
            user.name ??
            user.fullName ??
            "",

        email:
            user.email ??
            user.Email ??
            "",

        role:
            normalizedRole ||
            user.role,

        roleName:
            normalizedRole ||
            user.roleName ||
            user.role,

        contributorType:
            user.contributorType ??
            user.type ??
            user.userType ??
            null,

        subtype:
            user.subtype ??
            user.contributorSubtype ??
            user.subType ??
            null,

        phoneNumber:
            user.phoneNumber ??
            user.PhoneNumber ??
            null,

        bio:
            user.bio ??
            user.Bio ??
            null,

        isActive,

        status:
            user.status ??
            (isActive
                ? "Active"
                : "Inactive"),

        accountStatus:
            user.accountStatus ??
            (isActive
                ? "Active"
                : "Inactive"),
    };
}

/* =========================================================
   ADMIN USERS
========================================================= */

function AdminUsers() {
    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("All");

    const [
        roleFilter,
        setRoleFilter,
    ] = useState("All");

    const [
        createOpen,
        setCreateOpen,
    ] = useState(false);

    const [
        editUserOpen,
        setEditUserOpen,
    ] = useState(false);

    const [
        selectedUser,
        setSelectedUser,
    ] = useState(null);

    const [
        permissionsOpen,
        setPermissionsOpen,
    ] = useState(false);

    const [roles, setRoles] =
        useState(() =>
            getConfiguredRoles()
        );

    const [
        permissions,
        setPermissions,
    ] = useState(() =>
        getConfiguredPermissions()
    );

    const [
        contributorTypes,
        setContributorTypes,
    ] = useState(() =>
        getConfiguredContributorTypes()
    );

    const [
        contributorSubtypes,
        setContributorSubtypes,
    ] = useState(() =>
        getConfiguredContributorSubtypes()
    );

    const [
        organizations,
        setOrganizations,
    ] = useState(() =>
        getConfiguredOrganizations()
    );

    const [
        departments,
        setDepartments,
    ] = useState(() =>
        getConfiguredDepartments()
    );

    const [teams, setTeams] =
        useState(() =>
            getConfiguredTeams()
        );

    /* =====================================================
       LOAD USERS
    ===================================================== */

    const loadUsers =
        useCallback(
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const result =
                        await getUsers();

                    const normalized =
                        Array.isArray(
                            result
                        )
                            ? result
                                .map(
                                    normalizeApiUser
                                )
                                .filter(
                                    Boolean
                                )
                            : [];

                    setUsers(
                        normalized
                    );
                } catch (loadError) {
                    console.error(
                        "LOAD USERS ERROR:",
                        loadError
                    );

                    setError(
                        loadError?.message ||
                        "Unable to load users."
                    );
                } finally {
                    setLoading(false);
                }
            },
            []
        );

    /* =====================================================
       LOAD CONFIGURATION
    ===================================================== */

    const loadConfiguration =
        useCallback(
            () => {
                setRoles(
                    getConfiguredRoles()
                );

                setPermissions(
                    getConfiguredPermissions()
                );

                setContributorTypes(
                    getConfiguredContributorTypes()
                );

                setContributorSubtypes(
                    getConfiguredContributorSubtypes()
                );

                setOrganizations(
                    getConfiguredOrganizations()
                );

                setDepartments(
                    getConfiguredDepartments()
                );

                setTeams(
                    getConfiguredTeams()
                );
            },
            []
        );

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        loadConfiguration();
        loadUsers();
    }, [
        loadConfiguration,
        loadUsers,
    ]);

    /* =====================================================
       STORAGE EVENT
    ===================================================== */

    useEffect(() => {
        const handleStorage = () => {
            loadConfiguration();
        };

        window.addEventListener(
            "storage",
            handleStorage
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorage
            );
        };
    }, [
        loadConfiguration,
    ]);

    /* =====================================================
       FILTER USERS
    ===================================================== */

    const filteredUsers =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return users.filter(
                (user) => {
                    const name =
                        String(
                            user.fullName ??
                            user.name ??
                            ""
                        ).toLowerCase();

                    const email =
                        String(
                            user.email ??
                            ""
                        ).toLowerCase();

                    const role =
                        String(
                            user.roleName ??
                            user.role ??
                            ""
                        ).toLowerCase();

                    const contributorType =
                        String(
                            user.contributorType ??
                            ""
                        ).toLowerCase();

                    const subtype =
                        String(
                            user.subtype ??
                            user.contributorSubtype ??
                            user.subType ??
                            ""
                        ).toLowerCase();

                    const status =
                        user.isActive === false
                            ? "Inactive"
                            : "Active";

                    const matchesSearch =
                        !query ||
                        name.includes(
                            query
                        ) ||
                        email.includes(
                            query
                        ) ||
                        role.includes(
                            query
                        ) ||
                        contributorType.includes(
                            query
                        ) ||
                        subtype.includes(
                            query
                        );

                    const matchesStatus =
                        statusFilter ===
                            "All" ||
                        normalize(
                            status
                        ) ===
                            normalize(
                                statusFilter
                            );

                    const matchesRole =
                        roleFilter ===
                            "All" ||
                        normalize(
                            role
                        ) ===
                            normalize(
                                roleFilter
                            );

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesRole
                    );
                }
            );
        }, [
            users,
            search,
            statusFilter,
            roleFilter,
        ]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const stats =
        useMemo(() => {
            const active =
                users.filter(
                    (user) =>
                        user.isActive !==
                        false
                ).length;

            const inactive =
                users.length -
                active;

            const contributors =
                users.filter(
                    (user) =>
                        normalize(
                            user.roleName ??
                            user.role
                        ) ===
                        "contributor"
                ).length;

            return {
                total:
                    users.length,

                active,

                inactive,

                contributors,
            };
        }, [users]);

    /* =====================================================
       CREATE USER
    ===================================================== */

    const handleCreated =
        useCallback(
            async (newUser) => {
                if (!newUser) {
                    window.alert(
                        "User information is required."
                    );

                    return;
                }

                try {
                    setError("");

                    const result =
                        await createUser(
                            {
                                ...newUser,

                                contributorType:
                                    newUser.contributorType ??
                                    null,

                                subtype:
                                    newUser.subtype ??
                                    newUser.contributorSubtype ??
                                    null,
                            }
                        );

                    if (
                        !result?.success
                    ) {
                        window.alert(
                            result?.error ||
                            "Unable to create user."
                        );

                        return;
                    }

                    const createdUser =
                        normalizeApiUser(
                            result.user
                        );

                    addAuditLog(
                        "USER_CREATED",
                        createdUser ??
                            newUser,
                        `User ${
                            createdUser?.fullName ??
                            newUser.fullName ??
                            newUser.name ??
                            ""
                        } was created.`
                    );

                    if (
                        createdUser
                    ) {
                        addNotification(
                            createdUser,
                            "Your AI-PMS account has been created."
                        );
                    }

                    setCreateOpen(
                        false
                    );

                    await loadUsers();

                    window.alert(
                        result.message ||
                        "User created successfully."
                    );
                } catch (createError) {
                    console.error(
                        "CREATE USER ERROR:",
                        createError
                    );

                    window.alert(
                        createError?.message ||
                        "Unable to create user."
                    );
                }
            },
            [loadUsers]
        );

    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (
        user
    ) => {
        setSelectedUser(user);
        setEditUserOpen(true);
    };

    /* =====================================================
       UPDATE USER
    ===================================================== */

    const handleUpdateUser =
        async (
            updatedUser,
            metadata = {}
        ) => {
            if (!updatedUser) {
                throw new Error(
                    "User information is required."
                );
            }

            const userId =
                updatedUser.id ??
                updatedUser.userId;

            if (!userId) {
                throw new Error(
                    "User ID is required."
                );
            }

            const selectedRole =
                roles.find(
                    (role) =>
                        String(
                            role.id
                        ) ===
                            String(
                                updatedUser.roleId
                            ) ||
                        normalize(
                            role.name
                        ) ===
                            normalize(
                                updatedUser.role
                            )
                );

            if (!selectedRole) {
                throw new Error(
                    "Invalid role assignment."
                );
            }

            const selectedRoleName =
                normalize(
                    selectedRole.name ??
                    selectedRole.category ??
                    ""
                );

            const isContributorRole =
                selectedRoleName ===
                "contributor";

            const isManagerRole =
                selectedRoleName ===
                "manager";

            let contributorType =
                null;

            let subtype =
                null;

            /* =================================================
               CONTRIBUTOR TYPE
            ================================================= */

            if (
                isContributorRole
            ) {
                contributorType =
                    String(
                        updatedUser.contributorType ??
                        ""
                    ).trim();

                if (!contributorType) {
                    throw new Error(
                        "Please select a Contributor Type."
                    );
                }

                const validType =
                    contributorTypes.find(
                        (type) =>
                            normalize(
                                type.name
                            ) ===
                            normalize(
                                contributorType
                            ) ||
                            normalize(
                                type.id
                            ) ===
                            normalize(
                                contributorType
                            )
                    );

                if (!validType) {
                    throw new Error(
                        "Invalid Contributor Type."
                    );
                }

                contributorType =
                    validType.name;
            }

            /* =================================================
               CONTRIBUTOR SUBTYPE
            ================================================= */

            if (
                isContributorRole
            ) {
                subtype =
                    String(
                        updatedUser.subtype ??
                        updatedUser.contributorSubtype ??
                        ""
                    ).trim();

                if (!subtype) {
                    throw new Error(
                        "Please select a Contributor Subtype."
                    );
                }

                const validSubtypes =
                    contributorSubtypes.filter(
                        (item) => {
                            const itemType =
                                normalize(
                                    item.contributorType
                                );

                            return (
                                !itemType ||
                                itemType ===
                                    normalize(
                                        contributorType
                                    )
                            );
                        }
                    );

                const validSubtype =
                    validSubtypes.find(
                        (item) =>
                            normalize(
                                item.name
                            ) ===
                            normalize(
                                subtype
                            ) ||
                            normalize(
                                item.id
                            ) ===
                            normalize(
                                subtype
                            )
                    );

                if (!validSubtype) {
                    throw new Error(
                        "Invalid Contributor Subtype."
                    );
                }

                subtype =
                    validSubtype.name;
            }

            /* =================================================
               PERMISSIONS
            ================================================= */

            const selectedPermissionIds =
                Array.isArray(
                    updatedUser.selectedPermissionIds
                )
                    ? updatedUser.selectedPermissionIds
                    : Array.isArray(
                        updatedUser.permissionIds
                    )
                        ? updatedUser.permissionIds
                        : [];

            const permissionIds =
                getEffectivePermissionIds(
                    selectedRole,
                    permissions,
                    selectedPermissionIds
                );

            /* =================================================
               BACKEND REQUEST
            ================================================= */

            const requestData = {
                fullName:
                    String(
                        updatedUser.fullName ??
                        updatedUser.name ??
                        ""
                    ).trim(),

                email:
                    String(
                        updatedUser.email ??
                        ""
                    )
                        .trim()
                        .toLowerCase(),

                phoneNumber:
                    updatedUser.phoneNumber ??
                    null,

                bio:
                    updatedUser.bio ??
                    null,

                role:
                    normalizeUserRole(
                        selectedRole.name
                    ),

                contributorType:
                    isContributorRole
                        ? contributorType
                        : null,

                subtype:
                    isContributorRole
                        ? subtype
                        : null,

                permissionIds,

                permissions:
                    permissionIds,

                isActive:
                    updatedUser.isActive !==
                    false,
            };

            if (
                updatedUser.password
            ) {
                requestData.password =
                    updatedUser.password;

                requestData.confirmPassword =
                    updatedUser.confirmPassword;
            }

            const result =
                await editUser(
                    userId,
                    requestData
                );

            if (
                !result?.success
            ) {
                throw new Error(
                    result?.error ||
                    "Unable to update user."
                );
            }

            const finalUser =
                normalizeApiUser(
                    result.user
                ) ?? {
                    ...updatedUser,

                    id: userId,

                    role:
                        selectedRole.name,

                    roleName:
                        selectedRole.name,

                    contributorType,

                    subtype,

                    isActive:
                        updatedUser.isActive !==
                        false,

                    permissions:
                        permissionIds,
                };

            addAuditLog(
                "USER_PROFILE_UPDATED",
                finalUser,
                `Profile information for ${finalUser.fullName} was updated.`
            );

            if (
                metadata.roleChanged
            ) {
                addAuditLog(
                    "ROLE_UPDATED",
                    finalUser,
                    `Role changed to ${finalUser.roleName} for ${finalUser.fullName}.`
                );
            }

            if (
                metadata.permissionsChanged ||
                (
                    isManagerRole &&
                    Array.isArray(
                        updatedUser.selectedPermissionIds
                    )
                )
            ) {
                addAuditLog(
                    "PERMISSIONS_UPDATED",
                    finalUser,
                    `Permissions were updated for ${finalUser.fullName}.`
                );
            }

            if (
                metadata.contributorTypeChanged
            ) {
                addAuditLog(
                    "CONTRIBUTOR_TYPE_UPDATED",
                    finalUser,
                    `Contributor Type changed to ${contributorType}.`
                );
            }

            if (
                metadata.subtypeChanged
            ) {
                addAuditLog(
                    "CONTRIBUTOR_SUBTYPE_UPDATED",
                    finalUser,
                    `Contributor Subtype changed to ${subtype}.`
                );
            }

            await loadUsers();

            setSelectedUser(
                finalUser
            );

            return finalUser;
        };

    /* =====================================================
       VIEW
    ===================================================== */

    const handleView = (
        user
    ) => {
        console.log(
            "View user:",
            user
        );
    };

    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete =
        async (
            user
        ) => {
            const userId =
                user?.id ??
                user?.userId;

            if (!userId) {
                window.alert(
                    "User ID is missing."
                );

                return;
            }

            const confirmed =
                window.confirm(
                    `Delete ${
                        user.fullName ??
                        user.name ??
                        "this user"
                    }?`
                );

            if (!confirmed) {
                return;
            }

            try {
                const result =
                    await removeUser(
                        userId
                    );

                if (
                    !result?.success
                ) {
                    window.alert(
                        result?.error ||
                        "Unable to delete user."
                    );

                    return;
                }

                addAuditLog(
                    "USER_DELETED",
                    user,
                    `User ${
                        user.fullName ??
                        user.name ??
                        ""
                    } was deleted.`
                );

                await loadUsers();

                window.alert(
                    result.message ||
                    "User deleted successfully."
                );
            } catch (deleteError) {
                console.error(
                    "DELETE USER ERROR:",
                    deleteError
                );

                window.alert(
                    deleteError?.message ||
                    "Unable to delete user."
                );
            }
        };

    /* =====================================================
       ACTIVE / INACTIVE
    ===================================================== */

    const handleToggleStatus =
        async (
            user
        ) => {
            const userId =
                user?.id ??
                user?.userId;

            if (!userId) {
                window.alert(
                    "User ID is missing."
                );

                return;
            }

            const currentUser =
                getCurrentUser();

            if (
                currentUser?.id &&
                String(
                    currentUser.id
                ) ===
                    String(
                        userId
                    ) &&
                user.isActive !==
                    false
            ) {
                window.alert(
                    "You cannot deactivate your own account."
                );

                return;
            }

            const currentlyActive =
                user.isActive !==
                false;

            const newActive =
                !currentlyActive;

            try {
                const result =
                    await changeUserStatus(
                        userId,
                        newActive
                    );

                if (
                    !result?.success
                ) {
                    window.alert(
                        result?.error ||
                        "Unable to update user status."
                    );

                    return;
                }

                const updatedUser = {
                    ...user,

                    isActive:
                        newActive,

                    status:
                        newActive
                            ? "Active"
                            : "Inactive",

                    accountStatus:
                        newActive
                            ? "Active"
                            : "Inactive",
                };

                if (newActive) {
                    addAuditLog(
                        "USER_ACTIVATED",
                        updatedUser,
                        `${
                            updatedUser.fullName ??
                            updatedUser.name ??
                            "User"
                        } was activated.`
                    );

                    addNotification(
                        updatedUser,
                        "Your AI-PMS account has been activated."
                    );
                } else {
                    addAuditLog(
                        "USER_DEACTIVATED",
                        updatedUser,
                        `${
                            updatedUser.fullName ??
                            updatedUser.name ??
                            "User"
                        } was deactivated.`
                    );

                    addNotification(
                        updatedUser,
                        "Your AI-PMS account has been deactivated."
                    );
                }

                await loadUsers();

                window.alert(
                    result.message ||
                    (
                        newActive
                            ? "User activated successfully."
                            : "User deactivated successfully."
                    )
                );
            } catch (statusError) {
                console.error(
                    "CHANGE USER STATUS ERROR:",
                    statusError
                );

                window.alert(
                    statusError?.message ||
                    "Unable to update user status."
                );
            }
        };

    /* =====================================================
       ROLE OPTIONS
    ===================================================== */

    const roleOptions =
        useMemo(
            () =>
                roles.map(
                    (role) =>
                        role.name
                ),
            [roles]
        );

    /* =====================================================
       RETRY
    ===================================================== */

    const handleRetry =
        async () => {
            await loadUsers();
        };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-full bg-background p-6 text-foreground">

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserCog size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">
                                User Management
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage users, roles, contributor types and subtypes.
                            </p>
                        </div>

                    </div>
                </div>

                <div className="flex gap-2">

                    <Button
                        onClick={() =>
                            setPermissionsOpen(
                                true
                            )
                        }
                        variant="outline"
                        className="gap-2"
                    >
                        <KeyRound size={17} />
                        Manage Permissions
                    </Button>

                    <Button
                        onClick={() =>
                            setCreateOpen(
                                true
                            )
                        }
                        className="gap-2"
                    >
                        <UserPlus size={17} />
                        Create User
                    </Button>

                </div>

            </div>

            {error && (
                <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">

                    <span>
                        {error}
                    </span>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={
                            handleRetry
                        }
                    >
                        Retry
                    </Button>

                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Users size={21} />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Users
                            </p>

                            <p className="text-2xl font-bold">
                                {stats.total}
                            </p>
                        </div>

                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 size={21} />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Active
                            </p>

                            <p className="text-2xl font-bold">
                                {stats.active}
                            </p>
                        </div>

                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                            <AlertTriangle size={21} />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Inactive
                            </p>

                            <p className="text-2xl font-bold">
                                {stats.inactive}
                            </p>
                        </div>

                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-5">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                            <UserRound size={21} />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Contributors
                            </p>

                            <p className="text-2xl font-bold">
                                {stats.contributors}
                            </p>
                        </div>

                    </CardContent>
                </Card>

            </div>

            <Card>

                <CardHeader>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <CardTitle>
                                System Users
                            </CardTitle>

                            <CardDescription>
                                View and manage configured user accounts.
                            </CardDescription>
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row">

                            <div className="relative">

                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />

                                <input
                                    value={search}
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search users..."
                                    className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary md:w-64"
                                />

                            </div>

                            <select
                                value={
                                    roleFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setRoleFilter(
                                        event.target.value
                                    )
                                }
                                className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                            >

                                <option value="All">
                                    All Roles
                                </option>

                                {roleOptions.map(
                                    (
                                        role
                                    ) => (
                                        <option
                                            key={
                                                role
                                            }
                                            value={
                                                role
                                            }
                                        >
                                            {
                                                role
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                            >

                                <option value="All">
                                    All Status
                                </option>

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>

                    </div>

                </CardHeader>

                <CardContent className="p-0">

                    {loading ? (
                        <div className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">
                            Loading users...
                        </div>
                    ) : (
                        <UserTable
                            users={
                                filteredUsers
                            }

                            onEdit={
                                handleEdit
                            }

                            onDelete={
                                handleDelete
                            }

                            onView={
                                handleView
                            }

                            onToggle={
                                handleToggleStatus
                            }
                        />
                    )}

                    <div className="border-t border-border px-6 py-4 text-sm text-muted-foreground">

                        Showing{" "}

                        <span className="font-medium text-foreground">
                            {
                                filteredUsers.length
                            }
                        </span>

                        {" "}of{" "}

                        <span className="font-medium text-foreground">
                            {
                                users.length
                            }
                        </span>

                        {" "}users

                    </div>

                </CardContent>

            </Card>

            <CreateUserDialog
                open={
                    createOpen
                }

                onClose={() =>
                    setCreateOpen(
                        false
                    )
                }

                onCreated={
                    handleCreated
                }

                roles={
                    roles
                }

                permissions={
                    permissions
                }

                contributorTypes={
                    contributorTypes
                }

                contributorSubtypes={
                    contributorSubtypes
                }

                organizations={
                    organizations
                }

                departments={
                    departments
                }

                teams={
                    teams
                }

                allowManagerPermissionSelection={
                    true
                }

                adminGetsAllPermissions={
                    true
                }

                contributorPermissionSelection={
                    false
                }
            />

            <EditUserDialog
                open={
                    editUserOpen
                }

                onOpenChange={(
                    value
                ) => {
                    setEditUserOpen(
                        value
                    );

                    if (!value) {
                        setSelectedUser(
                            null
                        );
                    }
                }}

                user={
                    selectedUser
                }

                onSave={
                    handleUpdateUser
                }

                roles={
                    roles
                }

                permissions={
                    permissions
                }

                contributorTypes={
                    contributorTypes
                }

                contributorSubtypes={
                    contributorSubtypes
                }

                organizations={
                    organizations
                }

                departments={
                    departments
                }

                teams={
                    teams
                }

                canChangeRole={
                    true
                }

                allowManagerPermissionSelection={
                    true
                }

                adminGetsAllPermissions={
                    true
                }

                contributorPermissionSelection={
                    false
                }
            />

            {permissionsOpen && (
                <ManagePermissions
                    open={
                        permissionsOpen
                    }

                    onOpenChange={
                        setPermissionsOpen
                    }

                    users={
                        users
                    }

                    roles={
                        roles
                    }

                    permissions={
                        permissions
                    }

                    onSaved={() => {
                        loadConfiguration();
                        loadUsers();
                    }}
                />
            )}

        </div>
    );
}

export default AdminUsers;
