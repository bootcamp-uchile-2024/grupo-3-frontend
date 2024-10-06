import { ReactNode } from "react";
import { isAuth } from "../Servicios/LoginService"; 
import { userHasRole } from "../Servicios/LoginService";

interface PrivateRouteProps {
    children: ReactNode;
    roles: string[];
}

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
    const auth = isAuth(); // Verifica si el usuario está autenticado
    const hasRole = userHasRole(roles); // Verifica si tiene el rol adecuado

    // Si está autenticado y tiene el rol, muestra los hijos (children)
    if (auth && hasRole) {
        return <>{children}</>;
    }
    localStorage.removeItem('user');

    // Si no está autenticado o no tiene el rol, muestra acceso denegado
    return (
            <><p>Acceso denegado</p></>
    );
}
