import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserCreationForm.css';
import { validateEmail } from '../utils/validators';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

interface CheckoutInvitadoDTO {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rut: string;
  direccion: string;
  region: string;
  comuna: string;
  codigoPostal: string;
  numeroTarjeta: string;
  fechaExpiracion: string;
  cvv: string;
  nombreTarjeta: string;
}

const CartSummary = () => {
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-summary">
      <h3>Resumen de compra</h3>
      {cartItems.map((item: any) => (
        <div key={item.id} className="cart-item">
          <span>{item.name} x {item.quantity}</span>
          <span>${item.price * item.quantity}</span>
        </div>
      ))}
      <div className="cart-total">
        <strong>Total:</strong>
        <span>${total}</span>
      </div>
    </div>
  );
};

const CheckoutInvitadoForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CheckoutInvitadoDTO>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rut: '',
    direccion: '',
    region: '',
    comuna: '',
    codigoPostal: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTarjeta: ''
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rut: '',
    direccion: '',
    region: '',
    comuna: '',
    codigoPostal: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTarjeta: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {
      nombre: formData.nombre ? '' : 'El nombre es obligatorio',
      apellido: formData.apellido ? '' : 'El apellido es obligatorio',
      email: validateEmail(formData.email) || '',
      telefono: /^[0-9]+$/.test(formData.telefono) ? '' : 'El teléfono solo debe contener números',
      rut: formData.rut ? '' : 'El RUT es obligatorio',
      direccion: formData.direccion ? '' : 'La dirección es obligatoria',
      region: formData.region ? '' : 'La región es obligatoria',
      comuna: formData.comuna ? '' : 'La comuna es obligatoria',
      codigoPostal: formData.codigoPostal ? '' : 'El código postal es obligatorio',
      numeroTarjeta: /^[0-9]{16}$/.test(formData.numeroTarjeta) ? '' : 'Número de tarjeta inválido',
      fechaExpiracion: /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.fechaExpiracion) ? '' : 'Fecha inválida',
      cvv: /^[0-9]{3,4}$/.test(formData.cvv) ? '' : 'CVV inválido',
      nombreTarjeta: formData.nombreTarjeta ? '' : 'El nombre en la tarjeta es obligatorio'
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);

      try {
        // 1. Crear orden temporal
        const orderResponse = await fetch('http://localhost:8080/orders/guest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerInfo: {
              nombre: formData.nombre,
              apellido: formData.apellido,
              email: formData.email,
              telefono: formData.telefono,
              rut: formData.rut
            },
            shippingInfo: {
              direccion: formData.direccion,
              region: formData.region,
              comuna: formData.comuna,
              codigoPostal: formData.codigoPostal
            },
            cartItems: JSON.parse(localStorage.getItem('cart') || '[]')
          })
        });

        if (!orderResponse.ok) {
          throw new Error('Error al procesar la orden');
        }

        const orderData = await orderResponse.json();

        // 2. Procesar pago
        const paymentResponse = await fetch('http://localhost:8080/payments/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderData.id,
            paymentInfo: {
              numeroTarjeta: formData.numeroTarjeta,
              fechaExpiracion: formData.fechaExpiracion,
              cvv: formData.cvv,
              nombreTarjeta: formData.nombreTarjeta
            }
          })
        });

        if (!paymentResponse.ok) {
          throw new Error('Error al procesar el pago');
        }

        // 3. Limpiar carrito y redireccionar
        localStorage.removeItem('cart');
        alert('¡Compra realizada con éxito!');
        navigate('/confirmation', { state: { orderData } });

      } catch (error) {
        if (error instanceof Error) {
          alert(`Error al procesar la compra: ${error.message}`);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Container className="checkout-container">
      <Row>
        <Col md={8}>
          <Form onSubmit={handleSubmit} className="checkout-form">
            <h2 className="form-title">Checkout como Invitado</h2>

            <h3 className="section-title">Información Personal</h3>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="nombre">
                  <Form.Label>Nombre*</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    isInvalid={!!errors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="apellido">
                  <Form.Label>Apellido*</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    isInvalid={!!errors.apellido}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apellido}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email*</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="telefono">
                  <Form.Label>Teléfono*</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    isInvalid={!!errors.telefono}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.telefono}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="rut">
              <Form.Label>RUT*</Form.Label>
              <Form.Control
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleInputChange}
                isInvalid={!!errors.rut}
              />
              <Form.Control.Feedback type="invalid">
                {errors.rut}
              </Form.Control.Feedback>
            </Form.Group>

            <h3 className="section-title">Información de Envío</h3>
            <Form.Group className="mb-3" controlId="direccion">
              <Form.Label>Dirección*</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                isInvalid={!!errors.direccion}
              />
              <Form.Control.Feedback type="invalid">
                {errors.direccion}
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="region">
                  <Form.Label>Región*</Form.Label>
                  <Form.Select
                    name="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    isInvalid={!!errors.region}
                  >
                    <option value="">Seleccione región</option>
                    <option value="Metropolitana">Metropolitana</option>
                    {/* Agregar más regiones */}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.region}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="comuna">
                  <Form.Label>Comuna*</Form.Label>
                  <Form.Control
                    type="text"
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleInputChange}
                    isInvalid={!!errors.comuna}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.comuna}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="codigoPostal">
                  <Form.Label>Código Postal*</Form.Label>
                  <Form.Control
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    isInvalid={!!errors.codigoPostal}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.codigoPostal}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <h3 className="section-title">Información de Pago</h3>
            <Form.Group className="mb-3" controlId="numeroTarjeta">
              <Form.Label>Número de Tarjeta*</Form.Label>
              <Form.Control
                type="text"
                name="numeroTarjeta"
                value={formData.numeroTarjeta}
                onChange={handleInputChange}
                isInvalid={!!errors.numeroTarjeta}
              />
              <Form.Control.Feedback type="invalid">
                {errors.numeroTarjeta}
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="fechaExpiracion">
                  <Form.Label>Fecha de Expiración (MM/YY)*</Form.Label>
                  <Form.Control
                    type="text"
                    name="fechaExpiracion"
                    value={formData.fechaExpiracion}
                    onChange={handleInputChange}
                    isInvalid={!!errors.fechaExpiracion}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fechaExpiracion}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cvv">
                  <Form.Label>CVV*</Form.Label>
                  <Form.Control
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    isInvalid={!!errors.cvv}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cvv}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="nombreTarjeta">
              <Form.Label>Nombre en la Tarjeta*</Form.Label>
              <Form.Control
                type="text"
                name="nombreTarjeta"
                value={formData.nombreTarjeta}
                onChange={handleInputChange}
                isInvalid={!!errors.nombreTarjeta}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombreTarjeta}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="button-container">
              <Button
                variant="outline-primary"
                onClick={() => navigate("/cart")}
                className="btn-back"
              >
                Volver al Carrito
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit"
              >
                {isSubmitting ? "Procesando..." : "Completar Compra"}
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={4}>
          <CartSummary />
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutInvitadoForm;