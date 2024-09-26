import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../LoginFormStyles.css';

interface LoginFormProps {
  onLogin: (username: string, role: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  // Lista de usuarios simulada -- Roles usuario y administrador
  const users = [
    { username: 'administrador', password: 'administrador', role: 'admin' },
    { username: 'usuario', password: 'usuario', role: 'user' }
  ];

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    usernameError: '',
    passwordError: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [`${name}Error`]: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Buscar por nombre de usuario
    const foundUser = users.find(user => user.username === formData.username);

    // Validación
    if (!foundUser) {
      setErrors({ ...errors, usernameError: 'Nombre de usuario incorrecto' });
      return;
    }

    // Validación de la contraseña
    if (foundUser.password !== formData.password) {
      setErrors({ ...errors, passwordError: 'Contraseña incorrecta' });
      return;
    }

    // Alert
    alert(`Iniciaste sesión como ${foundUser.role === 'admin' ? 'Admin' : 'User'}`);
    onLogin(foundUser.username, foundUser.role);

    // Redirigir
    navigate('/');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        <div>
          <label htmlFor="username">Nombre de usuario:</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleInputChange} 
          />
          {errors.usernameError && <p style={{ color: 'red' }}>{errors.usernameError}</p>}
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} 
          />
          {errors.passwordError && <p style={{ color: 'red' }}>{errors.passwordError}</p>}
        </div>
        <button type="submit">Iniciar Sesión</button>

        <p>¿No tienes una cuenta? <Link to="/create-user">Crear una cuenta</Link></p>
      </form>
    </div>
  );
};

export default LoginForm;
