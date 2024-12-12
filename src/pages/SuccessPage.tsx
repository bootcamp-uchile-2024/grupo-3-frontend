import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/SuccessPage.css';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <Container className="success-container">
      <div className="success-content">
        <img 
          src="src/assets/icon-compra-exitosa.png" 
          alt="Planta feliz" 
          className="success-icon"
        />
        <h2 className="success-title">¡Compra Exitosa!</h2>
        <p className="success-message">
          Muchas Gracias Por tu Compra.
        </p>
        <p className="success-submessage">
          hemos enviado el recibo de tu compra a tu correo electrónico
        </p>
        <Button 
          variant="dark" 
          onClick={handleContinueShopping}
          className="continue-button"
          style={{ backgroundColor: '#1A4756' }}
        >
          Seguir comprando
        </Button>
      </div>
    </Container>
  );
};

export default SuccessPage;