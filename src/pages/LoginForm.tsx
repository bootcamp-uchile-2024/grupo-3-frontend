import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../LoginFormStyles.css';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos de inicio de sesión:', formData);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} 
          />
        </div>
        <button type="submit">Iniciar Sesión</button>

        <p>¿No tienes una cuenta? <Link to="/create-user">Crear una cuenta</Link></p>

      </form>

      
    </div>
  );
};

export default LoginForm;

