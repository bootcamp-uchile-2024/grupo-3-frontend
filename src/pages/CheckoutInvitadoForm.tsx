import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../styles/CheckoutInvitadoForm.css';
import { setCart } from '../states/cartSlice';
import regionesComunas from '../utils/regionesComunas';
import { CartItem } from '../interfaces/CartItem';

interface CheckoutInvitadoDTO {
  email: string;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  region: string;
  comuna: string;
  direccion: string;
  quienRecibe: string;
  formaEnvio: string;
  tipoRecibo: string;
  aceptaTerminos: boolean;
}

interface LocalCart {
  productos: CartItem[];
}

const API_BASE_URL = import.meta.env.VITE_URL_ENDPOINT_BACKEND || 'http://localhost:8080';

function isValidJWT(token: string | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 3;
}

function getUserIdFromJWT(token: string | null): number | null {
  if (!isValidJWT(token)) return null;
  try {
    const payload = JSON.parse(atob(token!.split('.')[1]));
    return payload.sub ?? null;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

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
      console.log('Carrito activo (Invitado) encontrado:', data);
      return data.id || null;
    }

    if (response.status === 404) {
      console.warn('Carrito no encontrado (Invitado) para el usuario:', userId);
      return null;
    }

    console.error('Error desconocido al obtener el carrito (Invitado):', response.status);
    return null;
  } catch (error) {
    console.error('Error GET del carrito activo (Invitado):', error);
    return null;
  }
};

const replaceCartProducts = async (token: string, cartId: number): Promise<number | null> => {
  try {
    const localCart: LocalCart = JSON.parse(localStorage.getItem('__redux__cart__') || '{}');
    console.log('Contenido del carrito local (Invitado):', localCart);

    if (!localCart || !localCart.productos || localCart.productos.length === 0) {
      console.warn('No hay productos en el carrito local (Invitado) para sincronizar.');
      return cartId;
    }

    const productosCarro = localCart.productos.map((producto: CartItem) => ({
      productoId: producto.id,
      cantidadProducto: producto.cantidad,
    }));

    const cuerpo = { productosCarro };
    console.log('Enviando al PUT /replaceProductos (Invitado):', JSON.stringify(cuerpo));

    const response = await fetch(`${API_BASE_URL}/carro-compras/replaceProductos/${cartId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo),
    });

    if (!response.ok) {
      console.error('Error al reemplazar los productos del carrito (Invitado):', response.status);
      return null;
    }

    console.log('Productos reemplazados exitosamente (Invitado).');
    return cartId;
  } catch (error) {
    console.error('Error en PUT replaceProductos (Invitado):', error);
    return null;
  }
};

const syncCartWithBackendInvitado = async (token: string): Promise<number | null> => {
  const userId = getUserIdFromJWT(token);
  if (!userId) {
    console.error('No se pudo extraer userId del token (Invitado).');
    return null;
  }

  const cartId = await getActiveCart(token, userId);
  if (!cartId) return null;

  return await replaceCartProducts(token, cartId);
};

const CheckoutInvitadoForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<CheckoutInvitadoDTO>({
    email: '',
    nombre: '',
    apellido: '',
    rut: '',
    telefono: '',
    region: '',
    comuna: '',
    direccion: '',
    quienRecibe: '',
    formaEnvio: 'envio',
    tipoRecibo: 'boleto',
    aceptaTerminos: false,
  });

  const [availableComunas, setAvailableComunas] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === 'region') {
      setAvailableComunas(regionesComunas[value] || []);
      setFormData((prev) => ({ ...prev, region: value, comuna: '' }));
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const existingToken = localStorage.getItem('token') || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      if (isValidJWT(existingToken)) {
        headers.Authorization = `Bearer ${existingToken}`;
      }

      const invitadoResp = await fetch(`${API_BASE_URL}/usuarios/visitante`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          rut: formData.rut,
        }),
      });

      if (!invitadoResp.ok) {
        const errData = await invitadoResp.json();
        console.error('Error al crear/actualizar invitado:', errData);
        alert(`Error: ${errData.message || 'Desconocido'}`);
        return;
      }

      const usuarioData = await invitadoResp.json();
      console.log('Usuario invitado creado/actualizado:', usuarioData);

      if (!usuarioData.access_token || !isValidJWT(usuarioData.access_token)) {
        alert('El backend no devolvió un token válido de invitado.');
        return;
      }

      localStorage.setItem('token', usuarioData.access_token);

      const syncedCartId = await syncCartWithBackendInvitado(usuarioData.access_token);
      if (!syncedCartId) {
        alert('No se pudo sincronizar el carrito. Intenta de nuevo.');
        return;
      }

      const localCartStr = localStorage.getItem('__redux__cart__');
      if (localCartStr) {
        const localCart: LocalCart = JSON.parse(localCartStr);
        if (localCart && localCart.productos) {
          dispatch(setCart(localCart.productos));
        }
      }

      navigate('/cart-page-pay', {
        state: {
          formData,
        },
      });

    } catch (error) {
      console.error('Error crítico en invitado:', error);
      alert('Hubo un problema. Intenta de nuevo.');
    }
  };

  return (
    <Container className="checkout-container">
      <h2 className="text-center">¿Eres nuevo en Plant AI?</h2>
      <p className="text-center text-muted">
        Regístrate y disfruta de nuestros <br /> productos y beneficios
      </p>

      <Form onSubmit={handleSubmit}>
        <section className="checkout-section">
          <h3>Mis datos:</h3>
          <Form.Group controlId="email">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>RUT</Form.Label>
                <Form.Control
                  type="text"
                  name="rut"
                  value={formData.rut}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </section>

        <section className="checkout-section">
          <h3>Información de despacho</h3>
          <Form.Group>
            <Form.Label>Forma de envío</Form.Label>
            <Form.Check
              type="radio"
              name="formaEnvio"
              value="retiro"
              label="Retiro en tienda"
              checked={formData.formaEnvio === 'retiro'}
              onChange={handleInputChange}
            />
            <Form.Check
              type="radio"
              name="formaEnvio"
              value="envio"
              label="Envío"
              checked={formData.formaEnvio === 'envio'}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Región</Form.Label>
                <Form.Select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione una región</option>
                  {Object.keys(regionesComunas).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Comuna</Form.Label>
                <Form.Select
                  name="comuna"
                  value={formData.comuna}
                  onChange={handleInputChange}
                  disabled={!formData.region}
                >
                  <option value="">Seleccione una comuna</option>
                  {availableComunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>¿Quién recibe?</Form.Label>
            <Form.Control
              type="text"
              name="quienRecibe"
              value={formData.quienRecibe}
              onChange={handleInputChange}
            />
          </Form.Group>
        </section>

        <div className="button-container">
          <Button variant="outline-secondary" onClick={() => navigate('/cart')}>
            Volver
          </Button>
          <Button variant="primary" type="submit">
            Pagar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CheckoutInvitadoForm;
