import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux'; 
import { RootState } from '../states/store';
import '../styles/CheckoutInvitadoForm.css';

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

interface CartItem {
  id: number;
  cantidad: number;
}

const CheckoutInvitadoForm: React.FC = () => {
  const navigate = useNavigate();

  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.email || !formData.nombre || !formData.telefono || !formData.quienRecibe) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }
    console.log('Datos preparados para enviar a CartPagePay:', {
      formData,
      cartItems,
    });
    
    console.log('Checkout Data:', { formData, cartItems });
    navigate('/cart-page-pay', { state: { formData, cartItems } });
  };
  

  return (
    <Container className="checkout-container">
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '10px',
          fontFamily: 'Quicksand, sans-serif',
          fontWeight: 700,
        }}
      >
        ¿Eres nuevo en Plant AI?
      </h2>
      <p
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#1A4756',
          fontWeight: 500,
        }}
      >
        Regístrate y disfruta de nuestros <br />
        productos y beneficios
      </p>

      <h3
        style={{
          fontWeight: 600,
          display: 'block',
          width: '79%',
        }}
      >
        Mis datos:
      </h3>
      <Form onSubmit={handleSubmit}>
        {/* Mis datos */}
        <section className="checkout-section">
          <Form.Group className="mb-3" controlId="email">
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
              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
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

          <Form.Check
            type="checkbox"
            label="Acepto Términos y Condiciones"
            name="aceptaTerminos"
            checked={formData.aceptaTerminos}
            onChange={handleInputChange}
            className="mb-3"
          />
        </section>

        {/* Información de despacho */}
        <section className="checkout-section">
          <h2>Información de despacho</h2>
          <Form.Group className="mb-3">
            <Form.Label>Forma de envío</Form.Label>
            <div>
              <Form.Check
                type="radio"
                name="formaEnvio"
                label="Retiro En Tienda"
                value="retiro"
                checked={formData.formaEnvio === 'retiro'}
                onChange={handleInputChange}
                inline
              />
              <Form.Check
                type="radio"
                name="formaEnvio"
                label="Envío"
                value="envio"
                checked={formData.formaEnvio === 'envio'}
                onChange={handleInputChange}
                inline
              />
            </div>
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Región</Form.Label>
                <Form.Select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                >
                  <option>Metropolitana</option>
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
                >
                  <option>Maipu</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
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

