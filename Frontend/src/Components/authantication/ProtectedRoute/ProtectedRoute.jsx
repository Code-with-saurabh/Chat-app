
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");

    if (!token) {
        // alert("You need to be logged in to access this page.");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;