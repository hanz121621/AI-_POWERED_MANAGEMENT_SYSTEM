
import React, { useEffect, useState } from "react";
import {
    UserRound,
    Mail,
    Phone,
    BriefcaseBusiness,
    UsersRound,
} from "lucide-react";

import api from "@/services/api";

const ViewTeamLeaderProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/Users/profile");

                const responseData = response?.data;

                const user =
                    responseData?.user ||
                    responseData?.User ||
                    responseData?.data ||
                    responseData?.Data ||
                    responseData;

                if (user && typeof user === "object") {
                    setProfile(user);

                    localStorage.setItem(
                        "aipms_current_user",
                        JSON.stringify(user)
                    );

                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(user)
                    );
                } else {
                    throw new Error("Profile information was not returned.");
                }
            } catch (apiError) {
                console.error(
                    "Failed to load Team Leader profile:",
                    apiError
                );

                // Fallback to cached profile if the API request fails.
                try {
                    const storedUser =
                        localStorage.getItem("aipms_current_user") ||
                        localStorage.getItem("currentUser") ||
                        localStorage.getItem("user");

                    if (storedUser) {
                        setProfile(JSON.parse(storedUser));
                    } else {
                        setError(
                            apiError?.response?.data?.message ||
                                apiError?.response?.data?.Message ||
                                "Your profile information could not be loaded."
                        );
                    }
                } catch (storageError) {
                    console.error(
                        "Failed to load cached profile:",
                        storageError
                    );

                    setError(
                        "Your profile information could not be loaded."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-slate-500">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <UserRound className="mx-auto mb-3 h-10 w-10 text-slate-400" />

                <h3 className="text-lg font-semibold text-slate-800">
                    Profile Not Available
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    {error ||
                        "Your profile information could not be loaded."}
                </p>
            </div>
        );
    }

    const fullName =
        profile.fullName ||
        profile.FullName ||
        profile.name ||
        profile.Name ||
        "Team Leader";

    const email =
        profile.email ||
        profile.Email ||
        "Not provided";

    const phone =
        profile.phoneNumber ||
        profile.PhoneNumber ||
        profile.phone ||
        profile.Phone ||
        "Not provided";

    const contributorType =
        profile.contributorTypeName ||
        profile.ContributorTypeName ||
        profile.contributorType ||
        profile.ContributorType ||
        "Team Leader";

    const contributorSubType =
        profile.contributorSubTypeName ||
        profile.ContributorSubTypeName ||
        profile.contributorSubType ||
        profile.ContributorSubType ||
        "Team Leader";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                    View Team Leader Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    View your personal and role information.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <UserRound className="h-8 w-8 text-blue-600" />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                            {fullName}
                        </h3>

                        <p className="text-sm text-slate-500">
                            Team Leader
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-blue-600" />

                            <div>
                                <p className="text-xs font-medium uppercase text-slate-500">
                                    Email
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-blue-600" />

                            <div>
                                <p className="text-xs font-medium uppercase text-slate-500">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {phone}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                            <BriefcaseBusiness className="h-5 w-5 text-blue-600" />

                            <div>
                                <p className="text-xs font-medium uppercase text-slate-500">
                                    Contributor Type
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {contributorType}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                            <UsersRound className="h-5 w-5 text-blue-600" />

                            <div>
                                <p className="text-xs font-medium uppercase text-slate-500">
                                    Contributor Sub-Type
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {contributorSubType}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTeamLeaderProfile;
