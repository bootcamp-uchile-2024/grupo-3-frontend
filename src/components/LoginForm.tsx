import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginForm.css';

export interface ILogin {
  username: string;
  password: string;
  roles?: string[];
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const users = [
    { username: 'administrador', password: 'administrador', roles: ['admin-1'] },
    { username: 'usuario', password: 'usuario', roles: ['user-1'] }
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

    const foundUser = users.find(u => u.username === formData.username);

    if (!foundUser) {
      setErrors(prev => ({ ...prev, usernameError: 'Nombre de usuario incorrecto' }));
      return;
    }

    if (foundUser.password !== formData.password) {
      setErrors(prev => ({ ...prev, passwordError: 'Contraseña incorrecta' }));
      return;
    }

    // Usar la función login del context
    login(
      foundUser.username,
      foundUser.roles.includes('admin-1') ? 'admin' : 'user',
      foundUser.roles
    );

    alert(`Iniciaste sesión como ${foundUser.roles.includes('admin-1') ? 'Admin' : 'User'}`);

    if (foundUser.roles.includes('admin-1')) {
      navigate('/user-management');
    } else {
      navigate('/');
    }
  };

  return (
    <Container className="login-container">
      <Card className="login-card">
        <Card.Body className="login-card-body">
          <h2 className="login-title">Iniciar sesión</h2>
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group className="form-group" controlId="username">
              <div className="label-container">
                <Form.Label className="form-label">Correo Electrónico</Form.Label>
              </div>
              <div className="input-container">
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Ingresa tu Correo Electrónico"
                  value={formData.username}
                  onChange={handleInputChange}
                  isInvalid={!!errors.usernameError}
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">{errors.usernameError}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="form-group" controlId="password">
              <div className="label-container">
                <Form.Label className="form-label">Contraseña</Form.Label>
              </div>
              <div className="input-container">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Ingresa tu Contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  isInvalid={!!errors.passwordError}
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">{errors.passwordError}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <div className="buttons-container">
              <Button variant="dark" type="submit" className="login-button">
                Ingresar
              </Button>

              <Link to="/crear-usuario" className="register-link">
                <Button variant="outline-dark" className="register-button">
                  Registrarme
                </Button>
              </Link>

              <Link to="/recuperar-contraseña" className="forgot-password-link">
                <p className="forgot-password-text">
                  ¿Olvidaste tu contraseña?
                </p>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;