import { ReactNode } from "react";
import { isAuth } from "../pages/LoginForm"; 
import { ILogin } from "../pages/LoginForm"; 

// Función que comprueba si el usuario tiene el rol requerido
export const userHasRole = (roles: string[]): boolean => {
    const user = localStorage.getItem('user');
    if (user) {
        const userResponse: ILogin = JSON.parse(user);
        return roles.some(role => userResponse.roles?.includes(role));
    }
    return false;
}

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

    // Si no está autenticado o no tiene el rol, muestra acceso denegado
    return (
            <p>Acceso denegado</p>
    );
}
