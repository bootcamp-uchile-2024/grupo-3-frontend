export const isAuth = (): boolean => {
    return localStorage.getItem('user') !== null; 
  };
  