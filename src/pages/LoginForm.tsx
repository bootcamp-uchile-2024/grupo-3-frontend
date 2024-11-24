import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';

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
      navigate('/');
    }
  };

  return (
    <Container
    className="d-flex justify-content-center align-items-center"
    style={{
      height: '100vh', 
    }}
  >
    <Card
      className="shadow-sm"
      style={{
        width: '707px',
        height: '465px',
        padding: '59px 123px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        flexShrink: 0,
        borderRadius: '8px',
        border: '1px solid #C7CCC7',
        backgroundColor: '#FFF',
      }}
    >
      <Card.Body className="d-flex flex-column align-items-center p-0">
        <h2 className="text-center mb-4" style={{ color: '#264653', fontWeight: 'bold' }}>
          Inicia sesión para comprar
        </h2>
        <Form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
          }}
        >
          <Form.Group className="mb-3" controlId="username">
            <Form.Label style={{ fontWeight: '500' }}>Correo electrónico</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Ingresa Tu Correo Electrónico"
              value={formData.username}
              onChange={handleInputChange}
              isInvalid={!!errors.usernameError}
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
            <Form.Control.Feedback type="invalid">{errors.usernameError}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label style={{ fontWeight: '500' }}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Ingresa Tu Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              isInvalid={!!errors.passwordError}
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
            <Form.Control.Feedback type="invalid">{errors.passwordError}</Form.Control.Feedback>
          </Form.Group>

          <div className="text-center mb-3">
            <Link to="/recuperar-contraseña" className="text-muted" style={{ fontSize: '0.9rem' }}>
              ¿Olvidaste Tu Contraseña?
            </Link>
          </div>

          <div className="d-flex flex-column gap-2">
            <Button
              variant="dark"
              type="submit"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                width: '153px', 
                height: '48px', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                backgroundColor: '#1A4756', 
                border: 'none', 
                color: '#FFFFFF', 
                fontWeight: 'bold', 
                fontSize: '1rem', 
                boxSizing: 'border-box', 
              }}
            >
              Ingresar
            </Button>

            <Link to="/crear-usuario">
              <Button
                variant="outline-dark"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  width: '153px', 
                  height: '48px', 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                }}
              >
                Crear una cuenta
              </Button>
            </Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  </Container>
);
};

export default LoginForm;


