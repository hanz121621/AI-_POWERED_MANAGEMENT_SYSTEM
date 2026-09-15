
import api from "@/services/api";

// ============================================================
// MANAGER PROFILE SERVICE
//
// PROF-001: View Profile
// PROF-002: Update Profile
// PROF-003: Change Password
// PROF-004: Update Profile Picture
//
// Backend is the source of truth.
// No localStorage is used for profile data.
// ============================================================


// ============================================================
// GET MY PROFILE
// GET /api/Users/profile
// ============================================================

export const getMyProfile = async () => {
    try {
        const response =
            await api.get("/Users/profile");

        const data =
            response?.data;

        const profile =
            data?.profile ??
            data?.Profile ??
            data?.data?.profile ??
            data?.data?.Profile ??
            data?.data ??
            data?.Data ??
            data;

        return {
            success: true,
            profile,
            data,

            message:
                data?.message ??
                data?.Message ??
                "Profile loaded successfully.",
        };
    } catch (error) {
        console.error(
            "GET MY PROFILE ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// VALIDATE PROFILE
// ============================================================

export const validateProfileForm = (
    formData
) => {
    const errors = {};

    // --------------------------------------------------------
    // FULL NAME
    // --------------------------------------------------------

    const fullName = String(
        formData?.fullName ?? ""
    ).trim();

    if (!fullName) {
        errors.fullName =
            "Full name is required.";
    } else if (fullName.length < 2) {
        errors.fullName =
            "Full name must contain at least 2 characters.";
    } else if (fullName.length > 100) {
        errors.fullName =
            "Full name cannot exceed 100 characters.";
    }


    // --------------------------------------------------------
    // EMAIL
    // --------------------------------------------------------

    const email = String(
        formData?.email ?? ""
    ).trim();

    if (!email) {
        errors.email =
            "Email address is required.";
    } else {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.email =
                "Please enter a valid email address.";
        } else if (email.length > 150) {
            errors.email =
                "Email address cannot exceed 150 characters.";
        }
    }


    // --------------------------------------------------------
    // PHONE NUMBER
    // --------------------------------------------------------

    const phoneNumber = String(
        formData?.phoneNumber ?? ""
    ).trim();

    if (phoneNumber) {
        const phoneRegex =
            /^[+]?[0-9\s\-()]{7,20}$/;

        if (!phoneRegex.test(phoneNumber)) {
            errors.phoneNumber =
                "Please enter a valid phone number.";
        }
    }


    return {
        isValid:
            Object.keys(errors).length === 0,

        errors,
    };
};


// ============================================================
// UPDATE MY PROFILE
// PUT /api/Users/profile
// ============================================================

export const updateMyProfile = async (
    formData
) => {
    try {
        const payload = {
            fullName: String(
                formData?.fullName ?? ""
            ).trim(),

            email: String(
                formData?.email ?? ""
            ).trim(),

            phoneNumber:
                String(
                    formData?.phoneNumber ?? ""
                ).trim() || null,

            profileImage:
                formData?.profileImage ??
                formData?.profilePicture ??
                null,
        };


        console.log(
            "========== UPDATE MY PROFILE =========="
        );

        console.log(
            "ENDPOINT:",
            "/Users/profile"
        );

        console.log(
            "PROFILE PAYLOAD:",
            {
                ...payload,
                profileImage:
                    payload.profileImage
                        ? "PROVIDED"
                        : null,
            }
        );


        const validation =
            validateProfileForm(
                payload
            );

        if (!validation.isValid) {
            const validationError =
                new Error(
                    "Profile validation failed."
                );

            validationError.validationErrors =
                validation.errors;

            throw validationError;
        }


        const response =
            await api.put(
                "/Users/profile",
                payload
            );


        const data =
            response?.data;


        const profile =
            data?.profile ??
            data?.Profile ??
            data?.data?.profile ??
            data?.data?.Profile ??
            data?.data ??
            data?.Data ??
            null;


        console.log(
            "PROFILE UPDATE RESPONSE:",
            data
        );


        return {
            success:
                data?.success ??
                data?.Success ??
                true,

            profile,

            data,

            message:
                data?.message ??
                data?.Message ??
                "Profile updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE MY PROFILE ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// VALIDATE PASSWORD
// ============================================================

export const validatePasswordForm = (
    currentPassword,
    newPassword,
    confirmPassword
) => {
    const errors = {};


    // --------------------------------------------------------
    // CURRENT PASSWORD
    // --------------------------------------------------------

    if (!currentPassword) {
        errors.currentPassword =
            "Current password is required.";
    }


    // --------------------------------------------------------
    // NEW PASSWORD
    // --------------------------------------------------------

    if (!newPassword) {
        errors.newPassword =
            "New password is required.";
    } else if (
        newPassword.length < 8
    ) {
        errors.newPassword =
            "Password must contain at least 8 characters.";
    } else if (
        newPassword.length > 128
    ) {
        errors.newPassword =
            "Password cannot exceed 128 characters.";
    }


    // --------------------------------------------------------
    // CONFIRM PASSWORD
    // --------------------------------------------------------

    if (!confirmPassword) {
        errors.confirmPassword =
            "Please confirm your new password.";
    } else if (
        newPassword !==
        confirmPassword
    ) {
        errors.confirmPassword =
            "Passwords do not match.";
    }


    // --------------------------------------------------------
    // SAME PASSWORD CHECK
    // --------------------------------------------------------

    if (
        currentPassword &&
        newPassword &&
        currentPassword ===
            newPassword
    ) {
        errors.newPassword =
            "New password must be different from the current password.";
    }


    return {
        isValid:
            Object.keys(errors).length === 0,

        errors,
    };
};


// ============================================================
// CHANGE MY PASSWORD
// POST /api/Auth/change-password
// ============================================================

export const changeMyPassword = async (
    currentPassword,
    newPassword,
    confirmPassword
) => {
    try {
        const payload = {
            currentPassword:
                String(
                    currentPassword ?? ""
                ),

            newPassword:
                String(
                    newPassword ?? ""
                ),

            confirmPassword:
                String(
                    confirmPassword ?? ""
                ),
        };


        const validation =
            validatePasswordForm(
                currentPassword,
                newPassword,
                confirmPassword
            );


        if (!validation.isValid) {
            const validationError =
                new Error(
                    "Password validation failed."
                );

            validationError.validationErrors =
                validation.errors;

            throw validationError;
        }


        console.log(
            "========== CHANGE MY PASSWORD =========="
        );

        console.log(
            "ENDPOINT:",
            "/Auth/change-password"
        );

        console.log(
            "PASSWORD PAYLOAD:",
            {
                currentPassword:
                    payload.currentPassword
                        ? "PROVIDED"
                        : "EMPTY",

                newPassword:
                    payload.newPassword
                        ? "PROVIDED"
                        : "EMPTY",

                confirmPassword:
                    payload.confirmPassword
                        ? "PROVIDED"
                        : "EMPTY",
            }
        );


        const response =
            await api.post(
                "/Auth/change-password",
                payload
            );


        const data =
            response?.data;


        return {
            success:
                data?.success ??
                data?.Success ??
                true,

            data,

            message:
                data?.message ??
                data?.Message ??
                "Password changed successfully.",
        };
    } catch (error) {
        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// UPDATE PROFILE PICTURE
// PUT /api/Users/profile
// ============================================================
//
// Backend currently accepts ProfileImage through the
// UpdateProfileDto.
//
// FullName and Email are required.
// Therefore callers must provide the current profile data.
// ============================================================

export const updateMyProfilePicture = async (
    profilePicture,
    profileData = {}
) => {
    try {
        const payload = {
            fullName: String(
                profileData?.fullName ?? ""
            ).trim(),

            email: String(
                profileData?.email ?? ""
            ).trim(),

            phoneNumber:
                String(
                    profileData?.phoneNumber ?? ""
                ).trim() || null,

            profileImage:
                profilePicture || null,
        };


        if (!payload.fullName) {
            throw new Error(
                "Full name is required to update the profile picture."
            );
        }


        if (!payload.email) {
            throw new Error(
                "Email address is required to update the profile picture."
            );
        }


        console.log(
            "========== UPDATE PROFILE IMAGE =========="
        );

        console.log(
            "ENDPOINT:",
            "/Users/profile"
        );

        console.log(
            "PROFILE IMAGE:",
            profilePicture
                ? "PROVIDED"
                : "EMPTY"
        );


        const response =
            await api.put(
                "/Users/profile",
                payload
            );


        const data =
            response?.data;


        const profile =
            data?.profile ??
            data?.Profile ??
            data?.data?.profile ??
            data?.data?.Profile ??
            null;


        return {
            success:
                data?.success ??
                data?.Success ??
                true,

            profile,

            data,

            message:
                data?.message ??
                data?.Message ??
                "Profile picture updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE PROFILE IMAGE ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// DEFAULT SERVICE OBJECT
// ============================================================

const ManagerProfileService = {
    getMyProfile,
    validateProfileForm,
    updateMyProfile,
    validatePasswordForm,
    changeMyPassword,
    updateMyProfilePicture,
};

export default ManagerProfileService;