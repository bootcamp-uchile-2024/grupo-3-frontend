import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { updateUserId } from '../states/cartSlice';
import '../styles/LoginFormStyles.css';
import { CartItem } from '../interfaces/CartItem';

interface LocalCart {
  productos: CartItem[];
}

interface LoginFormProps {
  onLogin: (user: { username: string; role: string }) => void;
}

const API_BASE_URL = import.meta.env.VITE_URL_ENDPOINT_BACKEND || 'http://localhost:8080';

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    usernameOrEmailError: '',
    passwordError: '',
    generalError: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [`${name}Error`]: '', generalError: '' });
  };

  const syncCartWithBackend = async (token: string, role: string): Promise<number | null> => {
    if (role === 'Super Admin' || role === 'Admin') {
      console.log('Usuario administrador, no se sincroniza carrito.');
      return null;
    }

    const userId = JSON.parse(atob(token.split('.')[1])).sub;
    console.log('ID de usuario extraído del token:', userId);

    try {
      const cartId = await getActiveCart(token, userId);

      if (!cartId) {
        console.error('No se encontró un carrito activo, aunque debería haberse creado automáticamente.');
        return null;
      }

      return await replaceCartProducts(token, cartId);
    } catch (error) {
      console.error('Error al sincronizar el carrito:', error);
      return null;
    }
  };

  const getActiveCart = async (token: string, userId: number): Promise<number | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/carro-compras/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Carrito activo encontrado:', data);
        return data.id || null;
      }

      if (response.status === 404) {
        console.warn('Carrito no encontrado para el usuario:', userId);
        return null;
      }

      console.error('Error desconocido al obtener el carrito:', response.status);
      return null;
    } catch (error) {
      console.error('Error en la petición GET del carrito activo:', error);
      return null;
    }
  };

  const replaceCartProducts = async (token: string, cartId: number): Promise<number | null> => {
    try {
      const localCart: LocalCart = JSON.parse(localStorage.getItem('__redux__cart__') || '{}');
      console.log('Contenido del carrito local:', localCart);

      if (!localCart || !localCart.productos || localCart.productos.length === 0) {
        console.warn('No hay productos en el carrito local para sincronizar.');
        return cartId;
      }

      const productosCarro = localCart.productos.map((producto: CartItem) => ({
        productoId: producto.id,
        cantidadProducto: producto.cantidad,
      }));

      const cuerpo = { productosCarro };
      console.log('Cuerpo enviado al PUT:', JSON.stringify(cuerpo));

      const response = await fetch(`${API_BASE_URL}/carro-compras/replaceProductos/${cartId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cuerpo),
      });

      if (response.ok) {
        console.log('Productos del carrito reemplazados exitosamente.');
        return cartId;
      }

      console.error('Error al reemplazar los productos del carrito:', response.status);
      return null;
    } catch (error) {
      console.error('Error en la petición PUT al reemplazar productos:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      const { access_token } = await response.json();
      localStorage.setItem('token', access_token);

      const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
      const userId = tokenPayload.sub;
      const userRole = tokenPayload.role || '';
      const username = tokenPayload.username || '';

      const userObj = {
        id: userId,
        role: userRole,
        username,
      };
      localStorage.setItem('user', JSON.stringify(userObj));

      dispatch(updateUserId(userId));

      const cartId = await syncCartWithBackend(access_token, userRole);

      onLogin({ username, role: userRole });

      if (userRole === 'Super Admin' || userRole === 'Admin') {
        console.log('Iniciando sesión como ADMIN');
        navigate('/user-management', { replace: true });
      } else {
        console.log('Iniciando sesión como CLIENTE');
        navigate('/cart-page-pay', {
          state: {
            cartId,
            formData: { direccion: '...', quienRecibe: '...' },
            pedidoId: 123,
          },
          replace: true,
        });
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
    <Container className="login-container vh-70">
      <Row className="justify-content-center">
        <Col xs={12} md={12} lg={12}>
          <Card className="login-card">
            <h2 className="login-title">Iniciar sesión</h2>
            <Form className="login-form" onSubmit={handleSubmit}>
              <Form.Label>Correo electrónico o Usuario</Form.Label>
              <Form.Control
                type="text"
                name="usernameOrEmail"
                placeholder="Ingresa tu Correo Electrónico o Usuario"
                value={formData.usernameOrEmail}
                onChange={handleInputChange}
                isInvalid={!!errors.usernameOrEmailError}
              />
              <Form.Control.Feedback type="invalid">
                {errors.usernameOrEmailError}
              </Form.Control.Feedback>

              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Ingresa tu Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.passwordError}
              />
              <Form.Control.Feedback type="invalid">
                {errors.passwordError}
              </Form.Control.Feedback>

              {errors.generalError && (
                <p className="text-danger">{errors.generalError}</p>
              )}

              <Row className="justify-content-center">
                <Col md={12} className="botones-login mt-3">
                  <Button
                    className="btn-primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                  </Button>

                  <Button className="btn-outline-primary">
                    <Link to="/crear-usuario" 
                    style={{ color: '#1A4756'}}>
                      Registrarme
                    </Link>
                  </Button>

                  <Link to="/recuperar-contraseña" className="forgot-password">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row className='mt-5'>
        <Col md={10} sm={12}>
          <Button
            className="back-button float-start"
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;