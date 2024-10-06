import { ReactNode } from "react";
import { isAuth } from "../Servicios/LoginService"; 
import { userHasRole } from "../Servicios/LoginService";

interface privateRouteProps {
    children: ReactNode;
    roles: string[];
}

export const PrivateRoute = ({ children, roles }: privateRouteProps) => {
    const auth = isAuth(); 
    const hasRole = userHasRole(roles); 

    if (auth && hasRole) {
        return <>{children}</>;
    }
    localStorage.removeItem('user');

    return (
            <><p>Acceso denegado</p></>
    );
}
