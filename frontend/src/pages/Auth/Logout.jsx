import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        /*
         * Clear authentication data.
         */
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");

        /*
         * Clear any old authentication keys
         * from the previous localStorage system.
         */
        localStorage.removeItem("aipms_token");
        localStorage.removeItem("aipms_user");

        /*
         * Prevent going back into the protected page.
         */
        navigate("/login", {
            replace: true,
        });
    }, [navigate]);

    return null;
}

export default Logout;