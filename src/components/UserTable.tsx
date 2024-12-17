import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { User } from '../types/types';

interface UserTableProps {
  currentUsers: User[];
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  onUserAction?: (userId: number) => void;
  onEditAction?: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  currentUsers,
  selectedUser,
  setSelectedUser,
  onUserAction,
  onEditAction,
}) => {
  useEffect(() => {
    const savedUserId = localStorage.getItem('selectedUserId');
    if (savedUserId) {
      const user = currentUsers.find((u) => u.id === parseInt(savedUserId));
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [currentUsers, setSelectedUser]);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUserId', user.id.toString());
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Table responsive hover>
        <thead>
          <tr>
            {[
              'ID',
              'Nombre',
              'Apellido',
              'Nombre Usuario',
              'Email',
              'Rut',
              'Fecha Nacimiento',
              'Teléfono',
              'Género',
              'Dirección',
            ].map((header, index) => (
              <th
                key={index}
                style={{
                  textAlign: 'center',
                  background: '#DCE2D3',
                  borderBottom: '1px solid #BBB',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#000',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr
              key={user.id}
              onClick={() => handleRowClick(user)} // Actualiza el usuario seleccionado
              style={{
                cursor: 'pointer',
                backgroundColor:
                  selectedUser?.id === user.id
                    ? '#6F8F75' // Color verde si está seleccionado
                    : index % 2 === 0
                    ? '#FFFFFF'
                    : '#F2F2F2', // Color alterno para filas impares
                transition: 'background-color 0.3s ease',
              }}
            >
              {[
                user.id,
                user.nombre,
                user.apellido,
                user.nombreUsuario,
                user.email,
                user.rut,
                new Date(user.fechaNacimiento).toLocaleDateString('es-ES'),
                user.telefono,
                user.genero,
                user.direccion || 'No especificada',
              ].map((value, idx) => (
                <td
                  key={idx}
                  style={{
                    textAlign: 'center',
                    borderTop: '1px solid #DDD',
                    padding: '8px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Botones de acción */}
      {selectedUser && (onUserAction || onEditAction) && (
        <div className="d-flex justify-content-center mt-3 gap-2">
          {onUserAction && (
            <Button variant="danger" onClick={() => onUserAction(selectedUser.id)}>
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserTable;


