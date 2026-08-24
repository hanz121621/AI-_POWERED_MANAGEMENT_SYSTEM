
import React, { useEffect, useState } from "react";

import {
    X,
    Save,
    User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function UpdateUserProfile({
    user,
    onClose,
    onSave,
}) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        team: "",
    });

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }

        setFormData({
            fullName:
                user.fullName ||
                user.name ||
                "",
            email: user.email || "",
            phone: user.phone || "",
            organization:
                user.organization || "",
            team:
                user.team || "",
        });

        setError("");
    }, [user]);

    if (!user) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const fullName =
            formData.fullName.trim();

        const email =
            formData.email.trim();

        if (!fullName) {
            setError(
                "Full name is required."
            );
            return;
        }

        if (!email) {
            setError(
                "Email address is required."
            );
            return;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError(
                "Please enter a valid email address."
            );
            return;
        }

        const updatedUser = {
            ...user,
            fullName,
            email,
            phone:
                formData.phone.trim() ||
                "Not provided",
            organization:
                formData.organization.trim() ||
                "Not assigned",
            team:
                formData.team.trim() ||
                "Not assigned",
        };

        try {
            setSaving(true);

            await onSave?.(updatedUser);

            onClose?.();
        } catch (saveError) {
            console.error(
                "Unable to update user profile:",
                saveError
            );

            setError(
                "Unable to update the user profile. Please try again."
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
                z-50
                flex
                items-center
                justify-center
                bg-black/70
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
                        onClose?.();
                    }
                }
            }}
        >
            <div
                className="
                    w-full
                    max-w-2xl
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
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        bg-slate-50
                        px-6
                        py-5
                        dark:border-slate-700
                        dark:bg-[#142538]
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-blue-600
                                dark:bg-blue-950/50
                                dark:text-blue-400
                            "
                        >
                            <User size={21} />
                        </div>

                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900
                                    dark:text-slate-50
                                "
                            >
                                Update User Profile
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Update account
                                information.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (!saving) {
                                onClose?.();
                            }
                        }}
                        disabled={saving}
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            transition-all
                            hover:bg-slate-200
                            hover:text-slate-700
                            dark:hover:bg-slate-800
                            dark:hover:text-slate-200
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                        aria-label="Close"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >
                    {/* Error */}

                    {error && (
                        <div
                            className="
                                mb-5
                                rounded-lg
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

                    <div className="space-y-5">

                        {/* ==================================================
                            FULL NAME
                        ================================================== */}

                        <div className="space-y-2">
                            <label
                                htmlFor="update-fullName"
                                className="
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                Full Name
                            </label>

                            <Input
                                id="update-fullName"
                                name="fullName"
                                value={
                                    formData.fullName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter full name"
                                disabled={saving}
                                className="
                                    border-slate-200
                                    bg-white
                                    dark:border-slate-700
                                    dark:bg-[#0d1c2b]
                                    dark:text-slate-100
                                "
                            />
                        </div>

                        {/* ==================================================
                            EMAIL + PHONE
                        ================================================== */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="update-email"
                                    className="
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >
                                    Email Address
                                </label>

                                <Input
                                    id="update-email"
                                    name="email"
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="user@example.com"
                                    disabled={saving}
                                    className="
                                        border-slate-200
                                        bg-white
                                        dark:border-slate-700
                                        dark:bg-[#0d1c2b]
                                        dark:text-slate-100
                                    "
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="update-phone"
                                    className="
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >
                                    Phone Number
                                </label>

                                <Input
                                    id="update-phone"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="+251 9XX XXX XXX"
                                    disabled={saving}
                                    className="
                                        border-slate-200
                                        bg-white
                                        dark:border-slate-700
                                        dark:bg-[#0d1c2b]
                                        dark:text-slate-100
                                    "
                                />
                            </div>
                        </div>

                        {/* ==================================================
                            ORGANIZATION + TEAM
                        ================================================== */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="update-organization"
                                    className="
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >
                                    Organization
                                </label>

                                <Input
                                    id="update-organization"
                                    name="organization"
                                    value={
                                        formData.organization
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Organization"
                                    disabled={saving}
                                    className="
                                        border-slate-200
                                        bg-white
                                        dark:border-slate-700
                                        dark:bg-[#0d1c2b]
                                        dark:text-slate-100
                                    "
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="update-team"
                                    className="
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >
                                    Team
                                </label>

                                <Input
                                    id="update-team"
                                    name="team"
                                    value={
                                        formData.team
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Team"
                                    disabled={saving}
                                    className="
                                        border-slate-200
                                        bg-white
                                        dark:border-slate-700
                                        dark:bg-[#0d1c2b]
                                        dark:text-slate-100
                                    "
                                />
                            </div>
                        </div>
                    </div>

                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div
                        className="
                            mt-6
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-slate-200
                            pt-5
                            dark:border-slate-700
                        "
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (!saving) {
                                    onClose?.();
                                }
                            }}
                            disabled={saving}
                            className="
                                border-slate-200
                                bg-white
                                text-slate-700
                                hover:bg-slate-100
                                dark:border-slate-700
                                dark:bg-[#16283c]
                                dark:text-slate-200
                                dark:hover:bg-slate-800
                            "
                        >
                            <X
                                size={16}
                                className="mr-2"
                            />
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                                dark:bg-blue-500
                                dark:hover:bg-blue-400
                            "
                        >
                            <Save
                                size={16}
                                className="mr-2"
                            />

                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateUserProfile;
