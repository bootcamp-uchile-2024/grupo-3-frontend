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

      if (userStored.roles.includes('admin-1')) {
        navigate('/user-management');
      } else {
        navigate('/');
      }
    }
  };


  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        marginTop: '120px',
        marginBottom: '64px',
      }}
    >
      <Card
        className="shadow-sm"
        style={{
          width: '440px',
          padding: '32px 32px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '8px',
          border: '1px solid #C7CCC7',
          backgroundColor: '#FFF',
        }}
      >
        <Card.Body className="d-flex flex-column align-items-center p-0">
          <h2
            style={{
              alignSelf: 'stretch',
              textAlign: 'center',
              color: '#1A4756',
              fontFamily: 'Quicksand, sans-serif',
              fontSize: '30px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '52px',
            }}
          >
            Iniciar sesión
          </h2>
          <Form
            onSubmit={handleSubmit}
            style={{
              width: '100%',
            }}
          >
            <Form.Group
              className="mb-3"
              controlId="username"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '440px',
                padding: '32px 32px 12px 32px',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  height: '44px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flexShrink: 0,
                  alignSelf: 'stretch',
                }}
              >
                <Form.Label
                  style={{
                    fontSize: '18px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '22px',
                    color: '#000',
                  }}
                >
                  Correo Electrónico
                </Form.Label>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  alignSelf: 'stretch',
                }}
              >
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Ingresa tu Correo Electrónico"
                  value={formData.username}
                  onChange={handleInputChange}
                  isInvalid={!!errors.usernameError}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #BBB',
                    backgroundColor: '#FFF',
                    padding: '10px',
                    width: '100%',
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.usernameError}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="password"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '440px',
                padding: '0px 32px 24px 32px',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  height: '44px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flexShrink: 0,
                  alignSelf: 'stretch',
                }}
              >
                <Form.Label
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '18px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '22px',
                    color: '#000',
                  }}
                >
                  Contraseña
                </Form.Label>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  alignSelf: 'stretch',
                }}
              >
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Ingresa tu Contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  isInvalid={!!errors.passwordError}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #BBB',
                    backgroundColor: '#FFF',
                    padding: '10px',
                    width: '100%',
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.passwordError}</Form.Control.Feedback>
              </div>
            </Form.Group>


            <div
              style={{
                display: 'flex',
                width: '230px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                margin: '0 auto',
              }}
            >
              {/* Botón Ingresar */}
              <Button
                variant="dark"
                type="submit"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  height: '48px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#1A4756',
                  border: 'none',
                  color: '#FFF',
                  fontFamily: 'Quicksand, sans-serif',
                  fontSize: '18px',
                  fontWeight: 500,
                  lineHeight: '22px',
                  textAlign: 'center',
                }}
              >
                Ingresar
              </Button>

              <Link to="/crear-usuario" style={{ width: '100%', textDecoration: 'none' }}>
                <Button
                  variant="outline-dark"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    height: '48px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: '22px',
                    color: '#1A4756',
                    textAlign: 'center',
                  }}
                >
                  Registrarme
                </Button>
              </Link>

              <Link to="/recuperar-contraseña" style={{ textDecoration: 'none' }}>
                <p
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: '22px',
                    color: '#1A4756',
                    textAlign: 'center',
                    margin: '0',
                  }}
                >
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


