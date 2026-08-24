import { useState } from "react";

import {
    X,
    ShieldCheck,
    Check,
    Lock,
} from "lucide-react";

const PERMISSIONS = [
    {
        id: "manage_users",
        label: "Manage Users",
        description:
            "Create, edit, activate, deactivate and delete users.",
    },
    {
        id: "assign_roles",
        label: "Assign Roles",
        description:
            "Assign or change user roles.",
    },
    {
        id: "manage_permissions",
        label: "Manage Permissions",
        description:
            "Grant, modify and revoke permissions.",
    },
    {
        id: "manage_projects",
        label: "Manage Projects",
        description:
            "Create and manage projects.",
    },
    {
        id: "manage_tasks",
        label: "Manage Tasks",
        description:
            "Create, update and manage tasks.",
    },
    {
        id: "manage_sprints",
        label: "Manage Sprints",
        description:
            "Create and manage project sprints.",
    },
    {
        id: "view_reports",
        label: "View Reports",
        description:
            "View project and performance reports.",
    },
    {
        id: "manage_organizations",
        label: "Manage Organizations",
        description:
            "Manage organization information.",
    },
    {
        id: "view_ai_suggestions",
        label: "View AI Suggestions",
        description:
            "Access AI-powered suggestions.",
    },
    {
        id: "view_risk_analysis",
        label: "View Risk Analysis",
        description:
            "View AI project risk analysis.",
    },
];

function ManagePermissions({
    user,
    onClose,
    onSave,
}) {
    /*
     * IMPORTANT:
     *
     * We intentionally initialize the state directly from
     * the user instead of using useEffect + setState.
     *
     * This fixes:
     *
     * react-hooks/set-state-in-effect
     *
     * The parent component uses:
     *
     * key={permissionUser.id}
     *
     * so React creates a fresh component instance when
     * another user is selected.
     */

    const [selectedPermissions, setSelectedPermissions] =
        useState(() =>
            Array.isArray(user?.permissions)
                ? [...user.permissions]
                : []
        );

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    if (!user) {
        return null;
    }

    const userName =
        user.fullName ||
        user.name ||
        user.username ||
        user.email ||
        "Unknown User";

    const userEmail =
        user.email || "No email provided";

    const userRole =
        user.role || "User";

    const selectedCount =
        selectedPermissions.length;

    const allSelected =
        PERMISSIONS.length > 0 &&
        selectedPermissions.length ===
            PERMISSIONS.length;

    // ============================================================
    // TOGGLE PERMISSION
    // ============================================================

    const handlePermissionChange = (
        permissionId
    ) => {
        setError("");

        setSelectedPermissions((previous) => {
            if (
                previous.includes(
                    permissionId
                )
            ) {
                return previous.filter(
                    (permission) =>
                        permission !==
                        permissionId
                );
            }

            return [
                ...previous,
                permissionId,
            ];
        });
    };

    // ============================================================
    // SELECT ALL / CLEAR ALL
    // ============================================================

    const handleSelectAll = () => {
        setError("");

        if (allSelected) {
            setSelectedPermissions([]);
            return;
        }

        setSelectedPermissions(
            PERMISSIONS.map(
                (permission) =>
                    permission.id
            )
        );
    };

    // ============================================================
    // SAVE
    // ============================================================

    const handleSave = async () => {
        if (!user) {
            setError("User not found.");
            return;
        }

        const validPermissionIds =
            PERMISSIONS.map(
                (permission) =>
                    permission.id
            );

        const invalidPermission =
            selectedPermissions.find(
                (permission) =>
                    !validPermissionIds.includes(
                        permission
                    )
            );

        if (invalidPermission) {
            setError(
                "Invalid permission selected."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            const updatedUser = {
                ...user,
                permissions: [
                    ...selectedPermissions,
                ],
            };

            await onSave(updatedUser);
        } catch (saveError) {
            console.error(
                "Unable to update permissions:",
                saveError
            );

            setError(
                "Unable to update permissions. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[60]
                flex
                items-center
                justify-center
                bg-slate-950/60
                p-4
                backdrop-blur-sm
                dark:bg-slate-950/75
            "
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    if (!saving) {
                        onClose();
                    }
                }
            }}
        >
            <div
                className="
                    flex
                    max-h-[90vh]
                    w-full
                    max-w-3xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    dark:border-slate-700
                    dark:bg-[#101f30]
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        bg-white
                        px-6
                        py-5
                        dark:border-slate-700
                        dark:bg-[#101f30]
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                dark:bg-blue-950/50
                                dark:text-blue-400
                            "
                        >
                            <ShieldCheck
                                size={23}
                            />
                        </div>

                        <div>
                            <h2
                                className="
                                    text-xl
                                    font-bold
                                    text-slate-900
                                    dark:text-slate-50
                                "
                            >
                                Manage Permissions
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Manage access
                                permissions for this
                                user.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            transition-all
                            hover:bg-slate-100
                            hover:text-slate-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:hover:bg-slate-800
                            dark:hover:text-slate-200
                        "
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ==================================================
                    USER INFORMATION
                ================================================== */}

                <div
                    className="
                        shrink-0
                        border-b
                        border-slate-200
                        bg-slate-50
                        px-6
                        py-4
                        dark:border-slate-700
                        dark:bg-[#142538]
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-slate-100
                                "
                            >
                                {userName}
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {userEmail}
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                w-fit
                                items-center
                                gap-2
                            "
                        >
                            <span
                                className="
                                    rounded-full
                                    bg-blue-100
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-blue-700
                                    dark:bg-blue-950/60
                                    dark:text-blue-300
                                "
                            >
                                {userRole}
                            </span>

                            <span
                                className="
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {selectedCount} selected
                            </span>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-6
                        py-5
                    "
                >
                    {/* Error */}

                    {error && (
                        <div
                            className="
                                mb-4
                                rounded-xl
                                border
                                border-rose-200
                                bg-rose-50
                                px-4
                                py-3
                                text-sm
                                text-rose-700
                                dark:border-rose-900/60
                                dark:bg-rose-950/30
                                dark:text-rose-300
                            "
                        >
                            {error}
                        </div>
                    )}

                    {/* Select All */}

                    <div
                        className="
                            mb-4
                            flex
                            flex-col
                            gap-4
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            dark:border-slate-700
                            dark:bg-[#142538]
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-slate-200
                                    text-slate-600
                                    dark:bg-slate-800
                                    dark:text-slate-300
                                "
                            >
                                <Lock size={18} />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-800
                                        dark:text-slate-100
                                    "
                                >
                                    Permissions
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Select the
                                    permissions this
                                    user can access.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSelectAll}
                            disabled={saving}
                            className="
                                rounded-lg
                                border
                                border-blue-200
                                bg-blue-50
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-blue-700
                                transition-all
                                hover:bg-blue-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:border-blue-800
                                dark:bg-blue-950/40
                                dark:text-blue-300
                                dark:hover:bg-blue-950/70
                            "
                        >
                            {allSelected
                                ? "Clear All"
                                : "Select All"}
                        </button>
                    </div>

                    {/* Permission List */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            md:grid-cols-2
                        "
                    >
                        {PERMISSIONS.map(
                            (permission) => {
                                const isSelected =
                                    selectedPermissions.includes(
                                        permission.id
                                    );

                                return (
                                    <button
                                        key={
                                            permission.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handlePermissionChange(
                                                permission.id
                                            )
                                        }
                                        disabled={saving}
                                        className={`
                                            flex
                                            items-start
                                            gap-3
                                            rounded-xl
                                            border
                                            p-4
                                            text-left
                                            transition-all
                                            duration-200
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                            ${
                                                isSelected
                                                    ? "border-blue-300 bg-blue-50 shadow-sm dark:border-blue-500 dark:bg-blue-950/30"
                                                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-700 dark:bg-[#142538] dark:hover:border-slate-600 dark:hover:bg-[#192d42]"
                                            }
                                        `}
                                    >
                                        <div
                                            className={`
                                                mt-0.5
                                                flex
                                                h-5
                                                w-5
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-md
                                                border
                                                transition-all
                                                ${
                                                    isSelected
                                                        ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                                                        : "border-slate-300 bg-white dark:border-slate-600 dark:bg-[#0d1c2b]"
                                                }
                                            `}
                                        >
                                            {isSelected && (
                                                <Check
                                                    size={14}
                                                    strokeWidth={
                                                        3
                                                    }
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className={`
                                                    text-sm
                                                    font-semibold
                                                    ${
                                                        isSelected
                                                            ? "text-blue-800 dark:text-blue-300"
                                                            : "text-slate-800 dark:text-slate-100"
                                                    }
                                                `}
                                            >
                                                {
                                                    permission.label
                                                }
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    leading-5
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                {
                                                    permission.description
                                                }
                                            </p>
                                        </div>
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        flex-col
                        gap-3
                        border-t
                        border-slate-200
                        bg-slate-50
                        px-6
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        dark:border-slate-700
                        dark:bg-[#142538]
                    "
                >
                    <p
                        className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {selectedCount} permission
                        {selectedCount === 1
                            ? ""
                            : "s"} selected
                    </p>

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-700
                                transition-all
                                hover:bg-slate-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:border-slate-700
                                dark:bg-[#16283c]
                                dark:text-slate-200
                                dark:hover:bg-slate-800
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition-all
                                hover:bg-blue-700
                                hover:shadow-md
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:bg-blue-500
                                dark:hover:bg-blue-400
                            "
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagePermissions;