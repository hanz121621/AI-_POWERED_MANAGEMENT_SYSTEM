
import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import {
    isAuthenticated,
    getCurrentUser,
} from "@/services/authService";

// ============================================================
// PROTECTED ROUTE
// ============================================================

function ProtectedRoute() {
    const location =
        useLocation();

    const authenticated =
        isAuthenticated();

    const currentUser =
        getCurrentUser();

    console.log(
        "========== PROTECTED ROUTE =========="
    );

    console.log(
        "PATH:",
        location.pathname
    );

    console.log(
        "AUTHENTICATED:",
        authenticated
    );

    console.log(
        "CURRENT USER:",
        currentUser
    );

    console.log(
        "======================================"
    );

    if (!authenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;