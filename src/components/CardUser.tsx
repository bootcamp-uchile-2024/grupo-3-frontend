import React from 'react';
import { Card } from 'react-bootstrap';
import { User } from '../types/types'; 

interface CardUserProps {
  selectedUser: User;
}

const CardUser: React.FC<CardUserProps> = ({ selectedUser }) => (
  <Card
    className="mb-4"
    style={{
      display: 'flex',
      width: '581px',
      height: '269px',
      padding: '57px 74px',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '10px',
      flexShrink: 0,
      borderRadius: '8px',
      background: '#DCE2D3',
      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
    }}
  >
    <Card.Body className="d-flex flex-column">
      <div className="d-flex align-items-center gap-3">
        <img
          src="https://via.placeholder.com/100"
          alt="Usuario"
          className="rounded-circle"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
        <div>
          <Card.Title className="mb-2">{`${selectedUser.nombre} ${selectedUser.apellido}`}</Card.Title>
          <Card.Text className="mb-0">
            <strong>Teléfono:</strong> {selectedUser.telefono}
          </Card.Text>
          <Card.Text className="mb-0">
            <strong>Email:</strong> {selectedUser.email}
          </Card.Text>
          <Card.Text className="mb-0">
            <strong>Dirección:</strong> {selectedUser.direccion || 'No especificada'}
          </Card.Text>
          <Card.Text className="mb-0">
            <strong>ID Usuario:</strong> {selectedUser.tipoUsuarioId}
          </Card.Text>
        </div>
      </div>
    </Card.Body>
  </Card>
);

export default CardUser;


