
import { useState } from "react";
import {
    UserRound,
    Pencil,
    ArrowLeft,
} from "lucide-react";

import ViewTeamLeaderProfile from "@/components/contributor/teamleader/profile/ViewTeamLeaderProfile";
import UpdateTeamLeaderProfile from "@/components/contributor/teamleader/profile/UpdateTeamLeaderProfile";

export default function Profile() {
    const [mode, setMode] = useState("view");

    const handleEdit = () => {
        setMode("edit");
    };

    const handleCancel = () => {
        setMode("view");
    };

    const handleSuccess = () => {
        setMode("view");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                        {/* Title */}

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                <UserRound className="h-6 w-6 text-blue-600" />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                    Profile Management
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    View and manage your Team Leader profile.
                                </p>
                            </div>

                        </div>

                        {/* Action */}

                        {mode === "view" ? (
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Profile
                            </button>
                        )}

                    </div>

                    {/* ==================================================
                        USE CASE INDICATOR
                    ================================================== */}

                    <div className="border-t border-slate-200 px-6 py-3">

                        <div className="flex items-center gap-2 text-xs text-slate-500">

                            <span className="font-medium text-slate-700">
                                Profile Management
                            </span>

                            <span>/</span>

                            <span
                                className={
                                    mode === "view"
                                        ? "font-medium text-blue-600"
                                        : "font-medium text-blue-600"
                                }
                            >
                                {mode === "view"
                                    ? "View Profile"
                                    : "Update Profile"}
                            </span>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    USE CASE CONTENT
                ================================================== */}

                {mode === "view" ? (
                    <ViewTeamLeaderProfile
                        onEdit={handleEdit}
                    />
                ) : (
                    <UpdateTeamLeaderProfile
                        onCancel={handleCancel}
                        onSuccess={handleSuccess}
                    />
                )}

            </div>
        </div>
    );
}
