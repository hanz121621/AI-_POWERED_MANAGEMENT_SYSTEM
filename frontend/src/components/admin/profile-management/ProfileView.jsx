import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Edit,
    Mail,
    Phone,
    RefreshCw,
    ShieldCheck,
    User,
    Users,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getCurrentUser,
    getUsers,
} from "@/services/authService";


// ============================================================
// PROF-001: VIEW PROFILE
// ============================================================
//
// Primary Actor:
// Admin
//
// Goal:
// Allow the authenticated admin to view their personal
// profile information stored in the AI-PMS.
//
// INFORMATION DISPLAYED:
//
// 1. Full name
// 2. Email address
// 3. Phone number
// 4. Assigned role
// 5. Organization
// 6. Team
// 7. Account status
// 8. Account creation date
// 9. Last login information
//
// ADMIN CAN:
//
// - View profile information
// - Navigate to Update Profile
//
// ADMIN CANNOT:
//
// - Modify profile information from this page
// - Change password from this page
// - Change role
// - Change organization
// - Change team
// - Change account status
//
// ============================================================


// ============================================================
// ROUTES
// ============================================================

const ADMIN_HOME_ROUTE = "/admin";
const EDIT_PROFILE_ROUTE = "/admin/profile/edit";
const LOGIN_ROUTE = "/login";


// ============================================================
// FIND CURRENT USER
// ============================================================
//
// The project already has getCurrentUser() and getUsers()
// inside authService.
//
// We use the authenticated user first.
//
// Then we search the users list to retrieve the latest
// stored profile information.
//
// ============================================================

function findCurrentUser(currentUser, users) {

    if (!currentUser) {
        return null;
    }

    if (!Array.isArray(users) || users.length === 0) {

        // ----------------------------------------------------
        // IMPORTANT:
        // If the users array is empty, do NOT immediately
        // consider the session expired.
        //
        // The authenticated user itself can still be used.
        // ----------------------------------------------------

        return currentUser;
    }


    const foundUser = users.find((user) => {

        // ----------------------------------------------------
        // Match by ID
        // ----------------------------------------------------

        if (
            currentUser.id !== undefined &&
            currentUser.id !== null &&
            user.id !== undefined &&
            user.id !== null &&
            String(user.id) === String(currentUser.id)
        ) {
            return true;
        }


        // ----------------------------------------------------
        // Match by userId
        // ----------------------------------------------------

        if (
            currentUser.userId !== undefined &&
            currentUser.userId !== null &&
            user.userId !== undefined &&
            user.userId !== null &&
            String(user.userId) ===
                String(currentUser.userId)
        ) {
            return true;
        }


        // ----------------------------------------------------
        // Match by email
        // ----------------------------------------------------

        if (
            currentUser.email &&
            user.email &&
            String(user.email)
                .trim()
                .toLowerCase() ===
                String(currentUser.email)
                    .trim()
                    .toLowerCase()
        ) {
            return true;
        }

        return false;
    });


    // --------------------------------------------------------
    // If user exists in users list, use latest profile.
    //
    // Otherwise use authenticated user.
    // --------------------------------------------------------

    return foundUser || currentUser;
}


// ============================================================
// CHECK ADMIN
// ============================================================

function isAdmin(user) {

    if (!user) {
        return false;
    }

    const role =
        user.role ||
        user.userRole ||
        user.assignedRole ||
        "";

    return (
        String(role)
            .trim()
            .toLowerCase() === "admin"
    );
}


// ============================================================
// PROFILE ACCESS ACTIVITY LOG
// ============================================================
//
// PROF-001 Main Success Scenario step 7:
//
// "The system records the profile access activity when
// required by the system's activity logging rules."
//
// Frontend version:
// Store the activity in localStorage.
//
// Backend version:
// This should eventually be sent to the .NET API.
//
// ============================================================

function recordProfileAccess(user) {

    try {

        if (!user) {
            return;
        }

        const existingLogs =
            localStorage.getItem("activityLogs");

        let activityLogs = [];

        if (existingLogs) {

            try {

                const parsedLogs =
                    JSON.parse(existingLogs);

                if (Array.isArray(parsedLogs)) {
                    activityLogs = parsedLogs;
                }

            } catch (error) {

                console.error(
                    "Unable to parse activity logs:",
                    error
                );

            }
        }


        const activity = {

            id:
                `PROFILE-${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 8)}`,

            userId:
                user.id ||
                user.userId ||
                null,

            userName:
                user.fullName ||
                user.name ||
                `${user.firstName || ""} ${
                    user.lastName || ""
                }`.trim() ||
                user.email ||
                "Unknown User",

            userEmail:
                user.email ||
                "",

            action:
                "VIEW_PROFILE",

            module:
                "Profile Management",

            description:
                "Admin viewed their profile information.",

            timestamp:
                new Date().toISOString(),

        };


        activityLogs.unshift(activity);


        // Keep only latest 100 activity records

        const limitedLogs =
            activityLogs.slice(0, 100);


        localStorage.setItem(
            "activityLogs",
            JSON.stringify(limitedLogs)
        );

    } catch (error) {

        console.error(
            "Unable to record profile access:",
            error
        );
    }
}


// ============================================================
// GET PROFILE DATA
// ============================================================
//
// PROF-001:
//
// Step 1:
// Admin opens Profile Management.
//
// Step 2:
// System identifies authenticated admin.
//
// Step 3:
// System retrieves profile.
//
// Step 4:
// System displays profile information.
//
// Alternative flows:
//
// A1 - Unable to retrieve profile
// A2 - Session expired
// A3 - Profile not found
// A4 - Access denied
//
// ============================================================

function getProfileData() {

    try {

        // ====================================================
        // STEP 2:
        // IDENTIFY AUTHENTICATED USER
        // ====================================================

        const currentUser =
            getCurrentUser();


        // ====================================================
        // A2:
        // SESSION EXPIRED
        // ====================================================

        if (!currentUser) {

            return {

                profile: null,

                errorType:
                    "SESSION_EXPIRED",

                errorMessage:
                    "Your session has expired. Please log in again.",
            };
        }


        // ====================================================
        // GET USERS
        // ====================================================

        let users = [];

        try {

            const result =
                getUsers();

            if (Array.isArray(result)) {
                users = result;
            }

        } catch (error) {

            console.error(
                "Unable to retrieve users:",
                error
            );

            // Do not immediately fail.
            //
            // The authenticated user can still be used
            // as the current profile.
            users = [];
        }


        // ====================================================
        // FIND AUTHENTICATED USER
        // ====================================================

        const profileUser =
            findCurrentUser(
                currentUser,
                users
            );


        // ====================================================
        // A3:
        // PROFILE NOT FOUND
        // ====================================================

        if (!profileUser) {

            return {

                profile: null,

                errorType:
                    "PROFILE_NOT_FOUND",

                errorMessage:
                    "Profile not found.",
            };
        }


        // ====================================================
        // A4:
        // ACCESS DENIED
        // ====================================================

        if (!isAdmin(profileUser)) {

            return {

                profile: null,

                errorType:
                    "ACCESS_DENIED",

                errorMessage:
                    "Access denied.",
            };
        }


        // ====================================================
        // SUCCESS
        // ====================================================

        return {

            profile:
                profileUser,

            errorType:
                "",

            errorMessage:
                "",
        };

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        // ====================================================
        // A1:
        // PROFILE RETRIEVAL FAILED
        // ====================================================

        return {

            profile: null,

            errorType:
                "LOAD_ERROR",

            errorMessage:
                "Unable to load profile information. Please try again.",
        };
    }
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "Not available";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Not available";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
}


// ============================================================
// FORMAT DATE + TIME
// ============================================================

function formatDateTime(dateValue) {

    if (!dateValue) {
        return "Not available";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Not available";
    }

    return date.toLocaleString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}


// ============================================================
// GET ACCOUNT STATUS
// ============================================================

function getAccountStatus(user) {

    if (!user) {
        return "Unknown";
    }


    if (
        typeof user.isActive ===
        "boolean"
    ) {

        return user.isActive
            ? "Active"
            : "Inactive";
    }


    if (
        typeof user.active ===
        "boolean"
    ) {

        return user.active
            ? "Active"
            : "Inactive";
    }


    if (user.status) {
        return user.status;
    }


    return "Active";
}


// ============================================================
// PROFILE ITEM
// ============================================================

function ProfileItem({
    icon: Icon,
    label,
    value,
}) {

    return (

        <div
            className="
                group
                flex
                items-start
                gap-4
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                transition-all
                duration-200

                dark:border-slate-700
                dark:bg-slate-800

                hover:-translate-y-0.5
                hover:border-blue-200
                hover:shadow-md

                dark:hover:border-blue-700
            "
        >

            {/* Icon */}

            <div
                className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-100

                    dark:bg-slate-700

                    group-hover:bg-blue-50
                    dark:group-hover:bg-blue-950
                "
            >

                <Icon
                    className="
                        h-5
                        w-5
                        text-slate-600

                        dark:text-slate-300

                        group-hover:text-blue-600
                        dark:group-hover:text-blue-400
                    "
                />

            </div>


            {/* Information */}

            <div className="min-w-0 flex-1">

                <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500

                        dark:text-slate-400
                    "
                >
                    {label}
                </p>


                <p
                    className="
                        mt-1
                        break-words
                        text-sm
                        font-semibold
                        text-slate-900

                        dark:text-slate-100
                    "
                >
                    {value || "Not provided"}
                </p>

            </div>

        </div>
    );
}


// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
    title,
    description,
}) {

    return (

        <div className="mb-5">

            <h2
                className="
                    text-lg
                    font-bold
                    text-slate-900

                    dark:text-slate-100
                "
            >
                {title}
            </h2>


            <p
                className="
                    mt-1
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                "
            >
                {description}
            </p>

        </div>
    );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

function ProfileView() {

    const navigate =
        useNavigate();


    // ========================================================
    // INITIAL DATA
    // ========================================================

    const initialData =
        getProfileData();


    const [profile, setProfile] =
        useState(
            initialData.profile
        );


    const [errorMessage, setErrorMessage] =
        useState(
            initialData.errorMessage
        );


    const [errorType, setErrorType] =
        useState(
            initialData.errorType
        );


    const [isLoading, setIsLoading] =
        useState(false);


    // ========================================================
    // RECORD PROFILE ACCESS
    // ========================================================
    //
    // Only record access when the profile was successfully
    // retrieved.
    //
    // ========================================================

    if (
        initialData.profile &&
        !initialData.errorMessage
    ) {

        // We intentionally do not use useEffect here.
        //
        // This runs when the component is initialized.
        //
        // For a backend implementation this will eventually
        // become an API activity-log request.

        const alreadyRecorded =
            sessionStorage.getItem(
                "profileAccessRecorded"
            );

        if (!alreadyRecorded) {

            recordProfileAccess(
                initialData.profile
            );

            sessionStorage.setItem(
                "profileAccessRecorded",
                "true"
            );
        }
    }


    // ========================================================
    // BACK TO ADMIN DASHBOARD
    // ========================================================

    const handleBack = () => {

        navigate(
            ADMIN_HOME_ROUTE
        );
    };


    // ========================================================
    // UPDATE PROFILE
    // ========================================================

    const handleEditProfile = () => {

        navigate(
            EDIT_PROFILE_ROUTE
        );
    };


    // ========================================================
    // LOGIN REDIRECT
    // ========================================================

    const handleLoginRedirect = () => {

        localStorage.removeItem(
            "user"
        );

        sessionStorage.removeItem(
            "profileAccessRecorded"
        );

        navigate(
            LOGIN_ROUTE,
            {
                replace: true,
            }
        );
    };


    // ========================================================
    // REFRESH PROFILE
    // ========================================================

    const loadProfile = () => {

        setIsLoading(true);

        setErrorMessage("");

        setErrorType("");


        setTimeout(() => {

            const result =
                getProfileData();


            setProfile(
                result.profile
            );


            setErrorMessage(
                result.errorMessage
            );


            setErrorType(
                result.errorType
            );


            setIsLoading(false);


            // Record access again after successful refresh

            if (
                result.profile &&
                !result.errorMessage
            ) {

                recordProfileAccess(
                    result.profile
                );
            }

        }, 300);
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (isLoading) {

        return (

            <div
                className="
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                    bg-slate-50

                    dark:bg-slate-950
                "
            >

                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            mb-4
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-blue-600

                            dark:border-slate-700
                            dark:border-t-blue-500
                        "
                    />


                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-600

                            dark:text-slate-300
                        "
                    >
                        Loading profile...
                    </p>

                </div>

            </div>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (errorMessage) {

        const isAccessDenied =
            errorType ===
            "ACCESS_DENIED";


        const isProfileNotFound =
            errorType ===
            "PROFILE_NOT_FOUND";


        const isSessionExpired =
            errorType ===
            "SESSION_EXPIRED";


        return (

            <div
                className="
                    min-h-[500px]
                    bg-slate-50
                    p-6

                    dark:bg-slate-950
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-4xl
                    "
                >

                    {/* Back */}

                    <Button
                        variant="ghost"
                        onClick={
                            handleBack
                        }
                        className="
                            mb-6
                            gap-2
                            text-slate-600

                            dark:text-slate-300
                        "
                    >

                        <ArrowLeft
                            className="h-4 w-4"
                        />

                        Back

                    </Button>


                    {/* Error Card */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-10
                            text-center
                            shadow-sm

                            dark:border-slate-700
                            dark:bg-slate-900
                        "
                    >

                        {/* Icon */}

                        {isAccessDenied ? (

                            <XCircle
                                className="
                                    mx-auto
                                    mb-4
                                    h-14
                                    w-14
                                    text-red-500
                                "
                            />

                        ) : isProfileNotFound ? (

                            <User
                                className="
                                    mx-auto
                                    mb-4
                                    h-14
                                    w-14
                                    text-slate-400
                                "
                            />

                        ) : isSessionExpired ? (

                            <ShieldCheck
                                className="
                                    mx-auto
                                    mb-4
                                    h-14
                                    w-14
                                    text-amber-500
                                "
                            />

                        ) : (

                            <ShieldCheck
                                className="
                                    mx-auto
                                    mb-4
                                    h-14
                                    w-14
                                    text-blue-500
                                "
                            />
                        )}


                        <h2
                            className="
                                text-xl
                                font-bold
                                text-slate-900

                                dark:text-slate-100
                            "
                        >
                            {errorMessage}
                        </h2>


                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-slate-500

                                dark:text-slate-400
                            "
                        >

                            {isSessionExpired
                                ? "Your authentication session is no longer valid. Please log in again."
                                : isAccessDenied
                                ? "You do not have permission to view this profile."
                                : isProfileNotFound
                                ? "The authenticated admin profile could not be found."
                                : "Please try again. If the problem continues, contact the system administrator."
                            }

                        </p>


                        {/* Action */}

                        {isSessionExpired ? (

                            <Button
                                className="
                                    mt-6
                                    gap-2
                                "
                                onClick={
                                    handleLoginRedirect
                                }
                            >

                                <ShieldCheck
                                    className="h-4 w-4"
                                />

                                Go to Login

                            </Button>

                        ) : (

                            <Button
                                className="
                                    mt-6
                                    gap-2
                                "
                                onClick={
                                    loadProfile
                                }
                            >

                                <RefreshCw
                                    className="h-4 w-4"
                                />

                                Try Again

                            </Button>
                        )}

                    </div>

                </div>

            </div>
        );
    }


    // ========================================================
    // NO PROFILE
    // ========================================================

    if (!profile) {
        return null;
    }


    // ========================================================
    // PROFILE VALUES
    // ========================================================

    const fullName =
        profile.fullName ||
        profile.name ||
        `${profile.firstName || ""} ${
            profile.lastName || ""
        }`.trim() ||
        "Not provided";


    const email =
        profile.email ||
        "Not provided";


    const phone =
        profile.phone ||
        profile.phoneNumber ||
        "Not provided";


    const role =
        profile.role ||
        profile.userRole ||
        profile.assignedRole ||
        "Not assigned";


    const organization =
        typeof profile.organization ===
        "object"

            ? profile.organization?.name

            : profile.organizationName ||
              profile.organization ||
              "Not assigned";


    const team =
        typeof profile.team ===
        "object"

            ? profile.team?.name

            : profile.teamName ||
              profile.team ||
              "Not assigned";


    const status =
        getAccountStatus(
            profile
        );


    const isActive =
        String(status)
            .trim()
            .toLowerCase() ===
        "active";


    const createdAt =
        profile.createdAt ||
        profile.createdDate ||
        profile.dateCreated ||
        profile.registrationDate;


    const lastLogin =
        profile.lastLogin ||
        profile.lastLoginAt ||
        profile.lastLoginDate;


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div
            className="
                min-h-full
                bg-slate-50
                p-4
                md:p-6

                dark:bg-slate-950
            "
        >

            <div
                className="
                    mx-auto
                    max-w-6xl
                "
            >


                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        {/* Breadcrumb */}

                        <div
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-slate-500

                                dark:text-slate-400
                            "
                        >

                            <span>
                                Admin
                            </span>

                            <span>
                                /
                            </span>

                            <span
                                className="
                                    font-medium
                                    text-slate-700

                                    dark:text-slate-200
                                "
                            >
                                Profile
                            </span>

                        </div>


                        {/* Title */}

                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-slate-900

                                dark:text-white

                                md:text-3xl
                            "
                        >
                            Profile Management
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500

                                dark:text-slate-400
                            "
                        >
                            View your personal account
                            information and profile details.
                        </p>

                    </div>


                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >

                        {/* Back */}

                        <Button
                            variant="outline"
                            onClick={
                                handleBack
                            }
                            className="
                                gap-2

                                border-slate-200
                                bg-white
                                text-slate-700

                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-200

                                hover:bg-slate-100
                                dark:hover:bg-slate-800
                            "
                        >

                            <ArrowLeft
                                className="h-4 w-4"
                            />

                            Back

                        </Button>


                        {/* Refresh */}

                        <Button
                            variant="outline"
                            onClick={
                                loadProfile
                            }
                            className="
                                gap-2

                                border-slate-200
                                bg-white
                                text-slate-700

                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-200

                                hover:bg-slate-100
                                dark:hover:bg-slate-800
                            "
                        >

                            <RefreshCw
                                className="h-4 w-4"
                            />

                            Refresh

                        </Button>


                        {/* UPDATE PROFILE */}

                        <Button
                            onClick={
                                handleEditProfile
                            }
                            className="
                                gap-2
                            "
                        >

                            <Edit
                                className="h-4 w-4"
                            />

                            Update Profile

                        </Button>

                    </div>

                </div>


                {/* ==================================================
                    PROFILE HEADER
                ================================================== */}

                <div
                    className="
                        mb-6
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm

                        dark:border-slate-700
                        dark:bg-slate-900
                    "
                >

                    {/* Cover */}

                    <div
                        className="
                            h-28
                            bg-gradient-to-r
                            from-slate-900
                            via-blue-900
                            to-slate-800
                        "
                    />


                    <div
                        className="
                            bg-white
                            px-6
                            pb-6

                            dark:bg-slate-900
                        "
                    >

                        <div
                            className="
                                -mt-12
                                flex
                                flex-col
                                gap-5

                                md:flex-row
                                md:items-end
                                md:justify-between
                            "
                        >

                            {/* USER */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    items-start
                                    gap-4

                                    sm:flex-row
                                    sm:items-end
                                "
                            >

                                {/* Avatar */}

                                <div
                                    className="
                                        flex
                                        h-24
                                        w-24
                                        shrink-0
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-2xl
                                        border-4
                                        border-white
                                        bg-slate-100
                                        shadow-lg

                                        dark:border-slate-900
                                        dark:bg-slate-800
                                    "
                                >

                                    {profile.profilePicture ||
                                    profile.avatar ? (

                                        <img
                                            src={
                                                profile.profilePicture ||
                                                profile.avatar
                                            }
                                            alt={fullName}
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />

                                    ) : (

                                        <span
                                            className="
                                                text-3xl
                                                font-bold
                                                text-blue-700

                                                dark:text-blue-400
                                            "
                                        >
                                            {fullName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    )}

                                </div>


                                {/* NAME */}

                                <div className="pb-1">

                                    <h2
                                        className="
                                            text-xl
                                            font-bold
                                            text-slate-900

                                            dark:text-white
                                        "
                                    >
                                        {fullName}
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500

                                            dark:text-slate-400
                                        "
                                    >
                                        {email}
                                    </p>


                                    {/* ROLE */}

                                    <div className="mt-2">

                                        <span
                                            className="
                                                inline-flex
                                                rounded-full
                                                bg-blue-50
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-blue-700

                                                dark:bg-blue-950
                                                dark:text-blue-300
                                            "
                                        >
                                            {role}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* ACCOUNT STATUS */}

                            <div
                                className={`
                                    inline-flex
                                    w-fit
                                    items-center
                                    gap-2
                                    rounded-full
                                    px-3
                                    py-1.5
                                    text-sm
                                    font-semibold

                                    ${
                                        isActive
                                            ? `
                                                bg-emerald-50
                                                text-emerald-700

                                                dark:bg-emerald-950
                                                dark:text-emerald-300
                                            `
                                            : `
                                                bg-red-50
                                                text-red-700

                                                dark:bg-red-950
                                                dark:text-red-300
                                            `
                                    }
                                `}
                            >

                                {isActive ? (

                                    <CheckCircle2
                                        className="h-4 w-4"
                                    />

                                ) : (

                                    <XCircle
                                        className="h-4 w-4"
                                    />
                                )}

                                {status}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    REQUIRED PROF-001 INFORMATION
                ================================================== */}

                <div
                    className="
                        grid
                        gap-6
                        lg:grid-cols-3
                    "
                >

                    {/* ==================================================
                        PERSONAL INFORMATION
                    ================================================== */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm

                            dark:border-slate-700
                            dark:bg-slate-900

                            lg:col-span-2
                        "
                    >

                        <SectionHeader
                            title="Personal Information"
                            description="
                                Your personal account information.
                            "
                        />


                        <div
                            className="
                                grid
                                gap-4
                                md:grid-cols-2
                            "
                        >

                            {/* FULL NAME */}

                            <ProfileItem
                                icon={User}
                                label="Full Name"
                                value={
                                    fullName
                                }
                            />


                            {/* EMAIL */}

                            <ProfileItem
                                icon={Mail}
                                label="Email Address"
                                value={
                                    email
                                }
                            />


                            {/* PHONE */}

                            <ProfileItem
                                icon={Phone}
                                label="Phone Number"
                                value={
                                    phone
                                }
                            />


                            {/* ROLE */}

                            <ProfileItem
                                icon={ShieldCheck}
                                label="Assigned Role"
                                value={
                                    role
                                }
                            />

                        </div>

                    </div>


                    {/* ==================================================
                        ORGANIZATION / TEAM
                    ================================================== */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm

                            dark:border-slate-700
                            dark:bg-slate-900
                        "
                    >

                        <SectionHeader
                            title="Organization & Team"
                            description="
                                Your current organization and team assignment.
                            "
                        />


                        <div className="space-y-4">

                            {/* ORGANIZATION */}

                            <ProfileItem
                                icon={Users}
                                label="Organization"
                                value={
                                    organization
                                }
                            />


                            {/* TEAM */}

                            <ProfileItem
                                icon={Users}
                                label="Team"
                                value={
                                    team
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ACCOUNT INFORMATION
                ================================================== */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm

                        dark:border-slate-700
                        dark:bg-slate-900
                    "
                >

                    <SectionHeader
                        title="Account Information"
                        description="
                            Information about your AI-PMS account.
                        "
                    />


                    <div
                        className="
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        {/* ACCOUNT CREATED */}

                        <ProfileItem
                            icon={CalendarDays}
                            label="Account Creation Date"
                            value={
                                formatDate(
                                    createdAt
                                )
                            }
                        />


                        {/* LAST LOGIN */}

                        <ProfileItem
                            icon={CalendarDays}
                            label="Last Login"
                            value={
                                formatDateTime(
                                    lastLogin
                                )
                            }
                        />


                        {/* ACCOUNT STATUS */}

                        <ProfileItem
                            icon={ShieldCheck}
                            label="Account Status"
                            value={
                                status
                            }
                        />


                        {/* ASSIGNED ROLE */}

                        <ProfileItem
                            icon={ShieldCheck}
                            label="Assigned Role"
                            value={
                                role
                            }
                        />

                    </div>

                </div>


                {/* ==================================================
                    UPDATE PROFILE SECTION
                ================================================== */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm

                        dark:border-slate-700
                        dark:bg-slate-900
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4

                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                Need to change your information?
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                Open Update Profile to modify
                                your authorized profile information.
                            </p>

                        </div>


                        <Button
                            onClick={
                                handleEditProfile
                            }
                            className="
                                shrink-0
                                gap-2
                            "
                        >

                            <Edit
                                className="h-4 w-4"
                            />

                            Update Profile

                        </Button>

                    </div>

                </div>


                {/* ==================================================
                    PROFILE SECURITY
                ================================================== */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-5

                        dark:border-blue-900
                        dark:bg-blue-950
                    "
                >

                    <div className="flex gap-3">

                        <ShieldCheck
                            className="
                                mt-0.5
                                h-5
                                w-5
                                shrink-0
                                text-blue-600

                                dark:text-blue-400
                            "
                        />


                        <div>

                            <p
                                className="
                                    font-semibold
                                    text-blue-900

                                    dark:text-blue-200
                                "
                            >
                                Profile Security
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-blue-700

                                    dark:text-blue-300
                                "
                            >
                                Your role, permissions, account
                                status, organization, and team
                                information are displayed for
                                review. Profile information is
                                read-only on this page.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    READ ONLY NOTICE
                ================================================== */}

                <div
                    className="
                        mt-4
                        text-center
                        text-xs
                        text-slate-400

                        dark:text-slate-500
                    "
                >
                    Profile information is displayed for review only.
                    No profile data is modified while viewing this page.
                </div>


            </div>

        </div>
    );
}


// ============================================================
// EXPORT
// ============================================================

export default ProfileView;