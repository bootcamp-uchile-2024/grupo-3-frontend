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
  users,
  currentUsers,
  selectedUser,
  setSelectedUser,
  onUserAction,
  onEditAction,
}) => {
  const totalUsers = users.length;
  const usersWithAddress = users.filter((user) => user.direccion).length;

  return (
    <div>
      {/* Resumen de usuarios */}
      <div className="mb-3">
        <p className="text-muted">
          Total de usuarios: <strong>{totalUsers}</strong>
        </p>
        <p className="text-muted">
          Usuarios con dirección registrada: <strong>{usersWithAddress}</strong>
        </p>
      </div>

      {/* Tabla de usuarios */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Nombre Usuario</th>
            <th>Email</th>
            <th>Rut</th>
            <th>Fecha Nacimiento</th>
            <th>Teléfono</th>
            <th>Género</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedUser?.id === user.id ? '#d3dbd5' : '',
              }}
            >
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.apellido}</td>
              <td>{user.nombreUsuario}</td>
              <td>{user.email}</td>
              <td>{user.rut}</td>
              <td>{new Date(user.fechaNacimiento).toLocaleDateString('es-ES')}</td>
              <td>{user.telefono}</td>
              <td>{user.genero}</td>
              <td>{user.direccion || 'No especificada'}</td>
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