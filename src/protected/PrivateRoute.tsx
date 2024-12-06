import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
    children: ReactNode;
    roles: string[];
}

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
    const { auth } = useAuth();

    // Verifica si el usuario está autenticado
    if (!auth.isAuthenticated || !auth.user) {
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }

    // Verifica si el usuario tiene los roles necesarios
    const hasRequiredRole = roles.some(role => auth.user?.roles?.includes(role));
    
    if (!hasRequiredRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};