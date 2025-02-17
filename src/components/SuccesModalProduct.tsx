import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { CreateProductData } from '../interfaces/CreateProductData';
import '../styles/SuccesModalProductStyle.css'

const SuccessModalProduct: React.FC<{
  show: boolean;
  handleClose: () => void;
  productCreated: CreateProductData | null;
}> = ({ show, handleClose, productCreated }) => {

  if (!productCreated) {
    return null;
  }
  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <Card className="cardContainerSucces">
        <button className="closeButton" onClick={handleClose}>×</button>
          <Card.Img 
            className='circleSuccesModalImage'
            src={productCreated.imagen}
          />
          <Card.Body className='textModal'>
            <Card.Title>{productCreated.nombre}</Card.Title>
            <a>{productCreated.ancho} x {productCreated.alto} x {productCreated.largo} cm</a>
            <a>{(productCreated.peso / 1000)} kg</a>
          </Card.Body>
        </Card>
        <Modal.Body className='mt-5'>
          <p>El producto ha sido creado con éxito.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button type="button" onClick={handleClose}>
            Volver
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuccessModalProduct;