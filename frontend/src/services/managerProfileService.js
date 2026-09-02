
import api from "@/services/api";

// ============================================================
// GET MY PROFILE
// GET /api/Users/profile
// ============================================================

export const getMyProfile = async () => {
    try {
        const response = await api.get("/Users/profile");

        const data = response?.data;

        return {
            success: true,

            profile:
                data?.profile ??
                data?.Profile ??
                data?.data ??
                data?.Data ??
                data,

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

export const validateProfileForm = (formData) => {
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
        /*
         * Correct email regex.
         *
         * IMPORTANT:
         * The previous version contained:
         *
         * **\\.**
         *
         * which is invalid for the intended validation.
         */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.email =
                "Please enter a valid email address.";
        }

        if (email.length > 150) {
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
        /*
         * Backend UpdateProfileDto:
         *
         * public string FullName { get; set; }
         * public string Email { get; set; }
         * public string? PhoneNumber { get; set; }
         * public string? Bio { get; set; }
         * public string? ProfileImage { get; set; }
         * public string? TechnicalSkills { get; set; }
         *
         * We only send fields that the manager is allowed
         * to modify from the profile page.
         */

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

            /*
             * Profile image is optional.
             *
             * Do not send undefined.
             */
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
            payload
        );

        const response = await api.put(
            "/Users/profile",
            payload
        );

        console.log(
            "PROFILE UPDATE RESPONSE:",
            response?.data
        );

        const data = response?.data;

        return {
            success: true,

            profile:
                data?.profile ??
                data?.Profile ??
                data?.data?.profile ??
                data?.data?.Profile ??
                null,

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
    } else if (newPassword.length < 8) {
        errors.newPassword =
            "Password must contain at least 8 characters.";
    } else if (newPassword.length > 128) {
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
        newPassword !== confirmPassword
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
        currentPassword === newPassword
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
        /*
         * Backend ChangePasswordRequestDto requires:
         *
         * CurrentPassword
         * NewPassword
         * ConfirmPassword
         */

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

        console.log(
            "========== CHANGE MY PASSWORD =========="
        );

        console.log(
            "ENDPOINT:",
            "/Auth/change-password"
        );

        /*
         * Never print actual passwords.
         */

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

        const response = await api.post(
            "/Auth/change-password",
            payload
        );

        console.log(
            "PASSWORD CHANGE RESPONSE:",
            response?.data
        );

        const data = response?.data;

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
// IMPORTANT:
//
// There is currently NO:
//
// POST /api/Users/profile-picture
//
// endpoint in your UsersController.
//
// ProfileImage belongs to UpdateProfileDto.
//
// Therefore this helper sends the image through:
//
// PUT /api/Users/profile
//
// Because FullName and Email are required by the backend,
// callers should provide the complete current profile data.
//
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

        console.log(
            "PROFILE IMAGE PAYLOAD:",
            {
                fullName:
                    payload.fullName,

                email:
                    payload.email,

                phoneNumber:
                    payload.phoneNumber
                        ? "PROVIDED"
                        : "EMPTY",

                profileImage:
                    payload.profileImage
                        ? "PROVIDED"
                        : "EMPTY",
            }
        );

        /*
         * Backend requires FullName and Email.
         *
         * If they are missing, fail before making a
         * request instead of sending an invalid request.
         */

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

        const response = await api.put(
            "/Users/profile",
            payload
        );

        console.log(
            "PROFILE IMAGE RESPONSE:",
            response?.data
        );

        const data = response?.data;

        return {
            success: true,

            profile:
                data?.profile ??
                data?.Profile ??
                data?.data?.profile ??
                data?.data?.Profile ??
                null,

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
