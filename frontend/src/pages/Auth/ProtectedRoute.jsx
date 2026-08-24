import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

function ProtectedRoute({ children, role }) {
    const {
        user,
        loading,
    } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        role &&
        user.role !== role
    ) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;