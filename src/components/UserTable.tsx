import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { User } from '../types/types';

interface UserTableProps {
  users: User[];
  currentUsers: User[];
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  return (
    <div
      style={{
        display: 'flex',
        width: '1072px',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Table
        responsive
        hover
        style={{
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          width: '100%', 
          marginTop: '76px', 
        }}
      >
        <thead>
          <tr>
            {[
              { header: 'ID', width: '5%' },
              { header: 'Nombre', width: '15%' },
              { header: 'Apellido', width: '15%' },
              { header: 'Nombre Usuario', width: '15%' },
              { header: 'Email', width: '20%' },
              { header: 'Rut', width: '10%' },
              { header: 'Fecha Nacimiento', width: '10%' },
              { header: 'Teléfono', width: '10%' },
              { header: 'Género', width: '10%' },
              { header: 'Dirección', width: '20%' },
            ].map((col, index) => (
              <th
                key={index}
                style={{
                  fontFamily: 'Quicksand',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '13px',
                  color: '#000',
                  textAlign: 'center',
                  borderBottom: '1px solid #BBB',
                  background: '#DCE2D3',
                  width: col.width, 
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                cursor: 'pointer',
                backgroundColor:
                  selectedUser?.id === user.id
                    ? '#6F8F75' 
                    : index % 2 === 0
                    ? '#FFFFFF' 
                    : '#BBB',    
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
                    borderTop: '1px solid #BBB',
                    textAlign: 'center',
                    padding: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
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
            <Button
              variant="danger"
              onClick={() => onUserAction(selectedUser.id)}
            >
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserTable;

