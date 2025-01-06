import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../styles/CheckoutInvitadoForm.css';
import { clearCart } from '../states/cartSlice';
import regionesComunas from '../utils/regionesComunas';

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
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        comuna: '',
      }));
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const verifyCartActive = async (): Promise<number | null> => {
    const token = localStorage.getItem('token');
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const userId = JSON.parse(atob(token!.split('.')[1])).sub;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/carro-compras/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
  
      if (!response.ok) {
        console.error('Error verificando carrito activo:', await response.json());
        return null;
      }
  
      const data = await response.json();
      console.log('Carrito activo encontrado:', data);
  
      if (!data.carroProductos || data.carroProductos.length === 0) {
        console.log('El carrito está vacío, sincronizando productos...');
        for (const item of cartItems) {
          const addResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/carro-compras/addProducto/${data.id}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productoId: item.id,
                cantidadProducto: item.cantidad,
              }),
            }
          );
  
          if (!addResponse.ok) {
            const errorData = await addResponse.json();
            console.error('Error al agregar producto:', errorData);
            throw new Error(errorData.message || 'Error al agregar producto al carrito.');
          }
        }
      }
  
      return data.id;
    } catch (error) {
      console.error('Error al verificar carrito activo:', error);
      return null;
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No se encontró el token de autorización. Por favor, inicia sesión nuevamente.');
      navigate('/login');
      return;
    }
  
    const userId = JSON.parse(atob(token.split('.')[1])).sub;
  
    const cartId = await verifyCartActive();
    if (!cartId) {
      alert('No se encontró un carrito activo. Por favor, intenta nuevamente.');
      return;
    }
  
    const pedidoPayload = {
      fechaCreacion: new Date().toISOString().split('T')[0],
      idCarro: cartId,
      idMedioPago: 1,
      idEstado: 1,
      idTipoDespacho: formData.formaEnvio === 'envio' ? 1 : 2,
      receptor: formData.quienRecibe,
      fechaEntrega: new Date(new Date().setDate(new Date().getDate() + 3))
        .toISOString()
        .split('T')[0],
      direccionEnvio: {
        comuna: formData.comuna,
        calle: formData.direccion,
        numero: '03010',
        departamento: '1215',
        referencia: 'Junto al supermercado',
      },
    };
  
    try {
      console.log('Enviando datos al endpoint de finalizar compra:', pedidoPayload);
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pedidoPayload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al finalizar la compra:', errorData);
        alert(`Error al finalizar la compra: ${errorData.message || 'Error desconocido'}`);
        return;
      }
  
      const data = await response.json();
      console.log('Pedido creado exitosamente:', data);
  
      dispatch(clearCart());
  
      navigate('/cart-page-pay', { state: { pedidoId: data.id, formData } });
    } catch (error) {
      console.error('Error crítico al procesar el pedido:', error);
      alert('Hubo un problema al procesar tu pedido. Por favor, inténtalo nuevamente.');
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



