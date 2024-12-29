import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import '../styles/LoginFormStyles.css';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    usernameError: '',
    passwordError: '',
    generalError: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [`${name}Error`]: '', generalError: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }
  
      const { access_token } = await response.json();
  
      if (!access_token) {
        throw new Error('El token de acceso no fue devuelto por el servidor');
      }
  
      localStorage.setItem('token', access_token);
  
      const decodedToken = JSON.parse(atob(access_token.split('.')[1]));
      console.log('Token decodificado:', decodedToken);
  
      const role = decodedToken.role || '';
      const isAdmin = role.toLowerCase() === 'super admin';
  
      console.log('Rol del usuario:', role);
      console.log('Redirigiendo a:', isAdmin ? '/user-management' : '/');
  
      localStorage.setItem('user', JSON.stringify({ username: decodedToken.username, role }));
  
      alert(`Iniciaste sesión como ${isAdmin ? 'Admin' : 'User'}`);
  
      if (isAdmin) {
        navigate('/user-management', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors((prev) => ({ ...prev, generalError: error.message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="login-card">
            <h2 className="login-title">Iniciar sesión</h2>
            <Form className='login-form' onSubmit={handleSubmit}>
              <Form.Label>Correo electrónico o Usuario</Form.Label>
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

              {errors.generalError && (
                <p className="text-danger">{errors.generalError}</p>
              )}

              <Row className="justify-content-center">
                <Col md={12} className='botones-login mt-3'>
                  <Button className="btn-primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Ingresando...' : 'Ingresar'}
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

