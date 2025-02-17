import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Card, Container } from 'react-bootstrap';
import '../styles/CheckoutLoginForm.css';

const CheckoutLoginForm: React.FC = () => {
  const navigate = useNavigate();

  const pedidoId = 123;
  const formData = {
    nombre: 'Juan Pérez',
    direccion: 'Calle Falsa 123',
    telefono: '+56912345678',
  }; 

  const handleContinueAsGuest = (): void => {
    navigate('/checkout-invitado');
  };

  const handleRegister = (): void => {
    navigate('/register');
  };

  const handleLogin = (): void => {
    navigate('/login', {
      state: {
        from: '/cart-page-pay',
        pedidoId, 
        formData, 
      },
    });
  };

  return (
    <Container className="login-container vh-70">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
          <div className="checkout-container d-flex justify-content-center">
            <Card className="checkout-card">
              <h3 className="checkout-title">
                ¿De qué forma gestionarás tu pedido?
              </h3>
              <div className="buttons-stack">
                <Button
                  className="btn-primary btn btn-primary"
                  onClick={handleLogin} 
                >
                  Iniciar sesión
                </Button>

                <Button
                  className="btn-registrar btn-outline-primary"
                  style={{ color: '#1A4756'}}
                  onClick={handleRegister}
                >
                  Registrarme
                </Button>
                <span
                  className="checkout-bajada-form"
                  onClick={handleContinueAsGuest}
                  style={{ cursor: 'pointer' }}
                >
                  Seguir como invitado
                </span>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={7} sm={12}>
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

export default CheckoutLoginForm;

