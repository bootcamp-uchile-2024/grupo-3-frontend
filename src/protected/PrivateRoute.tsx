import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
  roles: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token || !user || !user.role) {
    console.warn('Token inválido o usuario no autenticado. Redirigiendo al login.');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    console.warn('Acceso denegado. Redirigiendo al home.');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

