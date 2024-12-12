import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
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

    const userResponse: ILogin = {
      ...user,
      roles: foundUser.roles
    };

    const datosUsuario = JSON.stringify(userResponse);
    localStorage.setItem('user', datosUsuario);
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = { username: formData.username, password: formData.password };

    if (login(user)) {
      const userStored = JSON.parse(localStorage.getItem('user') || '{}');

      alert(`Iniciaste sesión como ${userStored.roles.includes('admin-1') ? 'Admin' : 'User'}`);

      onLogin(userStored.username, userStored.roles.includes('admin-1') ? 'admin' : 'user');

      if (userStored.roles.includes('admin-1')) {
        navigate('/user-management');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="login-card">
            <h2 className="login-title">Iniciar sesión</h2>
            <Form className='login-form' onSubmit={handleSubmit}>
            <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Ingresa tu Correo Electrónico"
                value={formData.username}
                onChange={handleInputChange}
                isInvalid={!!errors.usernameError}
              />
              <Form.Control.Feedback type="invalid">{errors.usernameError}</Form.Control.Feedback>
              
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Ingresa tu Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.passwordError}
              />
              <Form.Control.Feedback type="invalid">{errors.passwordError}</Form.Control.Feedback>
              <Row className="justify-content-center">
                <Col md={12} className='botones-login mt-3'>
                  <Button className="btn-primary" type="submit">
                    Ingresar
                  </Button>
                  <Link to="/crear-usuario">
                    <Button className="btn-registrar">
                      Registrarme
                    </Button>
                  </Link>
                  <Link to="/recuperar-contraseña" className="forgot-password">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;


