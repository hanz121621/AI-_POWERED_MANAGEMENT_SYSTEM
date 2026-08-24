import {
    useCallback,
    useState,
} from "react";

import {
    loginUser,
    logoutUser,
    getCurrentUser,
    getAccessToken,
    saveCurrentUser,
    isAuthenticated,
} from "@/services/authService";

import AuthContext from "./AuthContext";

// ============================================================
// GET INITIAL USER
// ============================================================

function getInitialUser() {
    const currentUser = getCurrentUser();
    const token = getAccessToken();

    if (currentUser && token) {
        return currentUser;
    }

    return null;
}

// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({ children }) {
    const [user, setUser] = useState(
        getInitialUser
    );

    // ========================================================
    // LOGIN
    // ========================================================

    const login = useCallback(
        async (email, password) => {
            try {
                const result = await loginUser(
                    email,
                    password
                );

                if (!result || result.error) {
                    return {
                        success: false,
                        error:
                            result?.error ||
                            "Invalid email or password.",
                    };
                }

                setUser(result);

                return {
                    success: true,
                    user: result,
                };
            } catch (error) {
                console.error(
                    "AUTH PROVIDER LOGIN ERROR:",
                    error
                );

                return {
                    success: false,
                    error:
                        error?.message ||
                        "Unable to login.",
                };
            }
        },
        []
    );

    // ========================================================
    // LOGOUT
    // ========================================================

    const logout = useCallback(
        async () => {
            try {
                await logoutUser();
            } catch (error) {
                console.error(
                    "Logout failed:",
                    error
                );
            } finally {
                setUser(null);
            }
        },
        []
    );

    // ========================================================
    // UPDATE USER
    // ========================================================

    const updateUser = useCallback(
        (updatedUser) => {
            if (!updatedUser) {
                saveCurrentUser(null);
                setUser(null);
                return;
            }

            saveCurrentUser(updatedUser);
            setUser(updatedUser);
        },
        []
    );

    // ========================================================
    // REFRESH USER
    // ========================================================

    const refreshUser = useCallback(() => {
        const currentUser =
            getCurrentUser();

        const token =
            getAccessToken();

        if (currentUser && token) {
            setUser(currentUser);
            return currentUser;
        }

        setUser(null);

        return null;
    }, []);

    // ========================================================
    // AUTHENTICATED STATUS
    // ========================================================

    const authenticated = Boolean(
        user && isAuthenticated()
    );

    // ========================================================
    // CONTEXT VALUE
    // ========================================================

    const value = {
        user,
        setUser,

        login,
        logout,

        updateUser,
        refreshUser,

        isAuthenticated:
            authenticated,

        accessToken:
            getAccessToken(),
    };

    // ========================================================
    // PROVIDER
    // ========================================================

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default AuthProvider;