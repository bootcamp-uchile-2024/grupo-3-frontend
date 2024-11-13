import { useEffect, useState } from 'react';
import UserCreateForm from './UserCreateForm';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/usuarios');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
      console.log('Usuario eliminado');
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Usuarios</h2>

      <div className="mb-4">
        <UserCreateForm onUserCreated={fetchUsers} />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Username</th>
              <th scope="col">Correo</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user) => {
  console.log(user);
  return (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => deleteUser(user.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
})}

          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;