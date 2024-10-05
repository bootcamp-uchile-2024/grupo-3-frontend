// Función para saber si el usuario está autenticado
export const isAuth = (): boolean => {
    return localStorage.getItem('user') !== null; 
  };
  