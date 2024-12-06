import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (username: string, role: string) => {
    // Aquí puedes manejar la lógica después del login
    console.log(`Usuario ${username} logueado como ${role}`);
    // Ejemplo de redirección basada en rol
    if (role === 'admin') {
      navigate('/user-management');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="login-page">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;