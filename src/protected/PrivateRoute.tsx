import { ReactNode } from "react";
import { isAuth, userHasRole } from "../services/LoginService";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: ReactNode;
    roles: string[];
}

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
    const auth = isAuth(); 
    const hasRole = userHasRole(roles); 

    if (!auth || !hasRole) {
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

