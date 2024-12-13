import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface SuccessModalProps {
  show: boolean;             
  handleClose: () => void;  
}

export const SuccessModalProduct: React.FC<SuccessModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>El producto ha sido cargado con éxito.</Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
          Volver
        </Button>
      </Modal.Footer>
    </Modal>
  );
};