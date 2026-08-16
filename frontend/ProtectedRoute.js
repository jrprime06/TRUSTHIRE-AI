import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {

    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Wrong role
    if (user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;