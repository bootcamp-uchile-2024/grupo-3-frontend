import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAuth } from '../utils/isAuth';
import '../styles/LoginFormStyles.css';

interface LoginFormProps {
  onLogin: (username: string, role: string) => void;
}

export interface ILogin {
  username: string;
  password: string;
  roles?: string[];
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const users = [
    { username: 'administrador', password: 'administrador', roles: ['admin-1'] },
    { username: 'usuario', password: 'usuario', roles: ['user-1'] }
  ];

  const [formData, setFormData] = useState<ILogin>({ username: '', password: '' });
  const [errors, setErrors] = useState<{ usernameError: string; passwordError: string }>({ usernameError: '', passwordError: '' });

  useEffect(() => {
    if (isAuth()) {
      alert('Usuario ya autenticado, redirigiendo al inicio.');
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [`${name}Error`]: '' }));
  };

  const login = (user: ILogin): boolean => {
    const foundUser = users.find(u => u.username === user.username);

    if (!foundUser) {
      setErrors(prev => ({ ...prev, usernameError: 'Nombre de usuario incorrecto' }));
      return false;
    }

    if (foundUser.password !== user.password) {
      setErrors(prev => ({ ...prev, passwordError: 'Contraseña incorrecta' }));
      return false;
    }

    const userResponse: ILogin = { ...user, roles: foundUser.roles };
    localStorage.setItem('user', JSON.stringify(userResponse)); 
    return true; 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user: ILogin = { username: formData.username, password: formData.password };

    if (login(user)) { 
      const userStored = JSON.parse(localStorage.getItem('user') || '{}');
      alert(`Iniciaste sesión como ${userStored.roles.includes('admin-1') ? 'Admin' : 'User'}`);
      onLogin(userStored.username, userStored.roles.includes('admin-1') ? 'admin' : 'user');
      navigate('/'); // Redirige al usuario a la página principal
    }
  };

  return (
    <main className="form-signin col-md-3 col-xs-3 col-lg-3 m-auto relative-top">
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal">Iniciar Sesión</h1>
        <div className="form-floating">
          <input
            type="text"
            className={`form-control ${errors.usernameError ? 'is-invalid' : ''}`} 
            id="floatingInput"
            placeholder="Nombre de usuario"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <label htmlFor="floatingInput">Nombre de usuario</label>
          {errors.usernameError && <div className="invalid-feedback">{errors.usernameError}</div>}
        </div>

        <div className="form-floating">
          <input
            type="password"
            className={`form-control ${errors.passwordError ? 'is-invalid' : ''}`}
            id="floatingPassword"
            placeholder="Contraseña"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <label htmlFor="floatingPassword">Contraseña</label>
          {errors.passwordError && <div className="invalid-feedback">{errors.passwordError}</div>}
        </div>

        <div className="form-check text-start my-3">
          <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
          <label className="form-check-label" htmlFor="flexCheckDefault">Recordarme</label>
        </div>

        <button className="btn btn-primary w-100 py-2" type="submit">Iniciar Sesión</button>

        <p className="mt-3">
          ¿No tienes una cuenta? <Link to="/create-user">Crear una cuenta</Link>
        </p>
      </form>
    </main>
  );
};

export default LoginForm;


