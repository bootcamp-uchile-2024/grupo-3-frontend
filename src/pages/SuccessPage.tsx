import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import '../styles/SuccessPage.css';
import successIcon from '../assets/icon-compra-exitosa.png';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const [compraId, setCompraId] = useState<string | null>(null);

  useEffect(() => {
    const stateCompraId = location.state?.compraId;
    
    if (stateCompraId) {
      setCompraId(stateCompraId);
      console.log('CompraId recibido desde state:', stateCompraId);
    } else {
      console.warn('No se encontró el ID de la compra (compraId) en location.state.');
    }
  }, [location.state]);

  const handleContinueShopping = () => {
    window.location.href = '/';
  };

  return (
    <Container className="success-container">
      <div className="success-content">
        <img
          src={successIcon}
          alt="Planta feliz"
          className="success-icon"
        />
        <h2 className="success-title">¡Compra Exitosa!</h2>

        <p className="success-message">Muchas Gracias Por tu Compra.</p>

        {compraId ? (
          <p className="success-submessage">
            Compra con ID: <strong>{compraId}</strong>
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