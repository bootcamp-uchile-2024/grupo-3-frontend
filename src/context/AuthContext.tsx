import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  username: string;
  role: string;
  roles?: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType {
  auth: AuthState;
  cartItemCount: number;
  setAuth: (auth: AuthState) => void;
  setCartItemCount: (count: number) => void;
  login: (username: string, role: string, roles: string[]) => void;
  logout: () => void;
}

const defaultContext: AuthContextType = {
  auth: {
    isAuthenticated: false,
    user: null
  },
  cartItemCount: 0,
  setAuth: () => {},
  setCartItemCount: () => {},
  login: () => {},
  logout: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(defaultContext.auth);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Verificar si hay usuario almacenado al cargar
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuth({
        isAuthenticated: true,
        user
      });
    }
  }, []);

  const login = (username: string, role: string, roles: string[]) => {
    const user = { username, role, roles };
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({
      isAuthenticated: true,
      user
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuth({
      isAuthenticated: false,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, cartItemCount, setCartItemCount, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);