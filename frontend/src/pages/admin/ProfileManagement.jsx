import { useEffect, useState } from "react";

import {
    UserRound,
    UserPen,
    RefreshCw,
} from "lucide-react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import ProfileView from "@/components/admin/profile-management/ProfileView";
import UpdateProfile from "@/components/admin/profile-management/UpdateProfile";


// ============================================================
// PROFILE MANAGEMENT
//
// PROF-001: View Profile
// PROF-002: Update Profile
//
// FLOW:
//
// /admin/profile
//      ↓
// ProfileManagement
//      ↓
// activeTab = "profile"
//      ↓
// ProfileView
//      ↓
// Click "Update Profile"
//      ↓
// onEdit()
//      ↓
// handleEdit()
//      ↓
// setActiveTab("edit")
//      ↓
// UpdateProfile
//
// IMPORTANT:
// There is NO /admin/profile/edit route.
// UpdateProfile is displayed inside /admin/profile.
// ============================================================


function ProfileManagement() {

    // ========================================================
    // STATE
    // ========================================================

    const [activeTab, setActiveTab] =
        useState("profile");

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================================
    // LOAD CURRENT USER
    // ========================================================

    useEffect(() => {

        const loadCurrentUser = () => {

            try {

                setLoading(true);
                setError("");


                // ------------------------------------------------
                // GET AUTHENTICATED USER
                // ------------------------------------------------

                const storedUser =
                    localStorage.getItem("user");


                // ------------------------------------------------
                // NO USER
                // ------------------------------------------------

                if (!storedUser) {

                    setUser(null);

                    setError(
                        "Profile information could not be loaded."
                    );

                    return;
                }


                // ------------------------------------------------
                // PARSE USER
                // ------------------------------------------------

                const parsedUser =
                    JSON.parse(storedUser);


                // ------------------------------------------------
                // INVALID USER
                // ------------------------------------------------

                if (!parsedUser) {

                    setUser(null);

                    setError(
                        "Profile not found."
                    );

                    return;
                }


                // ------------------------------------------------
                // SAVE USER
                // ------------------------------------------------

                setUser(parsedUser);

            } catch (error) {

                console.error(
                    "Profile loading error:",
                    error
                );

                setUser(null);

                setError(
                    "Unable to load profile information. Please try again."
                );

            } finally {

                setLoading(false);

            }

        };


        loadCurrentUser();

    }, []);


    // ============================================================
    // EDIT PROFILE
    //
    // ProfileView calls:
    //
    // onEdit()
    //
    // which comes here.
    //
    // We DO NOT navigate to another URL.
    //
    // We simply change the active tab.
    // ============================================================

    const handleEdit = () => {

        setActiveTab("edit");

    };


    // ============================================================
    // CANCEL UPDATE
    //
    // UpdateProfile calls:
    //
    // onCancel()
    //
    // Then we return to ProfileView.
    // ============================================================

    const handleCancel = () => {

        setActiveTab("profile");

    };


    // ============================================================
    // PROFILE UPDATED
    //
    // UpdateProfile calls:
    //
    // onSuccess(updatedUser)
    //
    // We update the user information and return
    // to View Profile.
    // ============================================================

    const handleProfileUpdated = (
        updatedUser
    ) => {

        setUser(updatedUser);

        setActiveTab("profile");

    };


    // ============================================================
    // REFRESH PROFILE
    // ============================================================

    const handleRefresh = () => {

        try {

            setLoading(true);
            setError("");


            // ------------------------------------------------
            // GET USER AGAIN
            // ------------------------------------------------

            const storedUser =
                localStorage.getItem("user");


            // ------------------------------------------------
            // USER NOT FOUND
            // ------------------------------------------------

            if (!storedUser) {

                setUser(null);

                setError(
                    "Profile not found."
                );

                return;
            }


            // ------------------------------------------------
            // PARSE USER
            // ------------------------------------------------

            const parsedUser =
                JSON.parse(storedUser);


            // ------------------------------------------------
            // INVALID USER
            // ------------------------------------------------

            if (!parsedUser) {

                setUser(null);

                setError(
                    "Profile not found."
                );

                return;
            }


            // ------------------------------------------------
            // UPDATE USER
            // ------------------------------------------------

            setUser(parsedUser);

        } catch (error) {

            console.error(
                "Profile refresh error:",
                error
            );

            setUser(null);

            setError(
                "Unable to load profile information. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <div
            className="
                min-h-full
                space-y-6
                p-4
                md:p-6
            "
        >

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-5
                    shadow-sm

                    md:flex-row
                    md:items-center
                    md:justify-between
                "
            >

                {/* ==================================================
                    HEADER INFORMATION
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >

                    {/* ICON */}

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-primary
                            text-primary-foreground
                            shadow-sm
                        "
                    >

                        <UserRound
                            className="
                                h-6
                                w-6
                            "
                        />

                    </div>


                    {/* TITLE */}

                    <div>

                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-foreground
                            "
                        >
                            Profile Management
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            View and manage your personal
                            profile information.
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    REFRESH BUTTON
                ================================================== */}

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="
                        gap-2
                    "
                >

                    <RefreshCw
                        className={`
                            h-4
                            w-4
                            ${loading ? "animate-spin" : ""}
                        `}
                    />

                    Refresh

                </Button>

            </div>


            {/* ==================================================
                PROFILE MANAGEMENT CARD
            ================================================== */}

            <div
                className="
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    shadow-sm
                "
            >

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >

                    {/* ==================================================
                        TAB HEADER
                    ================================================== */}

                    <div
                        className="
                            border-b
                            border-border
                            px-4
                            py-3

                            md:px-6
                        "
                    >

                        <TabsList
                            className="
                                grid
                                w-full
                                grid-cols-2

                                md:w-fit
                            "
                        >

                            {/* ==================================================
                                VIEW PROFILE TAB
                            ================================================== */}

                            <TabsTrigger
                                value="profile"
                                className="
                                    gap-2
                                "
                            >

                                <UserRound
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                <span>
                                    View Profile
                                </span>

                            </TabsTrigger>


                            {/* ==================================================
                                UPDATE PROFILE TAB
                            ================================================== */}

                            <TabsTrigger
                                value="edit"
                                className="
                                    gap-2
                                "
                            >

                                <UserPen
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                <span>
                                    Update Profile
                                </span>

                            </TabsTrigger>

                        </TabsList>

                    </div>


                    {/* ==================================================
                        PROF-001
                        VIEW PROFILE
                    ================================================== */}

                    <TabsContent
                        value="profile"
                        className="
                            m-0
                            p-4

                            md:p-6
                        "
                    >

                        <ProfileView
                            user={user}
                            loading={loading}
                            error={error}
                            onEdit={handleEdit}
                            onRefresh={handleRefresh}
                        />

                    </TabsContent>


                    {/* ==================================================
                        PROF-002
                        UPDATE PROFILE
                    ================================================== */}

                    <TabsContent
                        value="edit"
                        className="
                            m-0
                            p-4

                            md:p-6
                        "
                    >

                        <UpdateProfile
                            user={user}
                            onCancel={handleCancel}
                            onSuccess={handleProfileUpdated}
                        />

                    </TabsContent>

                </Tabs>

            </div>


            {/* ==================================================
                BUSINESS RULE INFORMATION
            ================================================== */}

            <div
                className="
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50
                    p-4

                    dark:border-blue-900
                    dark:bg-blue-950/30
                "
            >

                <div
                    className="
                        flex
                        gap-3
                    "
                >

                    <UserRound
                        className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                            text-blue-600
                        "
                    />


                    <div>

                        <p
                            className="
                                font-semibold
                                text-blue-900

                                dark:text-blue-300
                            "
                        >
                            Profile Management
                        </p>


                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-blue-700

                                dark:text-blue-400
                            "
                        >
                            You can update your permitted
                            personal information from the
                            Update Profile tab. Your role,
                            permissions, and account status
                            are managed separately through
                            the appropriate administration
                            functions.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}


// ============================================================
// EXPORT
// ============================================================

export default ProfileManagement;