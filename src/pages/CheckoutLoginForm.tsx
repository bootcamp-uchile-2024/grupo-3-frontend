import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Card, Container } from 'react-bootstrap';
import '../styles/CheckoutLoginForm.css';

const CheckoutLoginForm: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs={12} md={5}>
          <div className="checkout-container">
            <Card className="checkout-card">
              <h2 className="checkout-title">
                ¿De que forma gestionaras tu pedido?
              </h2>
              <div className="buttons-stack">
                <Button className="action-button primary-button">
                  Iniciar sesión
                </Button>
                <Button className="action-button secondary-button">
                  Registrarme
                </Button>
                <span className="checkout-bajada-form">
                  Seguir como invitado
                </span>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
        <Button className="back-button float-start" onClick={() => navigate(-1)}>
              Volver
        </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutLoginForm;