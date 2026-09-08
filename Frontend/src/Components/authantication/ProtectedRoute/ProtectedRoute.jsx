import { Navigate } from "react-router-dom";

const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem("accessToken");

    if (!token || isTokenExpired(token)) {
        sessionStorage.clear();
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
