import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import '../styles/SuccessPage.css';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    const stateCartId = location.state?.cartId;
    const storedCartId = localStorage.getItem('cartId');
  
    if (stateCartId) {
      setCartId(stateCartId);
      console.log('CartId recibido desde state:', stateCartId);
    } else if (storedCartId) {
      setCartId(storedCartId);
      console.log('CartId recuperado desde localStorage:', storedCartId);
    } else {
      console.warn('No se encontró el cartId en state ni en localStorage.');
    }
  }, [location.state]);
  
  

  const handleContinueShopping = () => {
    window.location.href = '/';
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
        <p className="success-message">Muchas gracias por tu compra.</p>
        {cartId ? (
          <p className="success-submessage">
            Compra con ID: <strong>{cartId}</strong>
          </p>
        ) : (
          <p className="error-message">No se encontró el ID de la compra.</p>
        )}
        <p className="success-submessage">
          Hemos enviado el recibo de tu compra a tu correo electrónico.
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

