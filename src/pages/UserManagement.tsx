import { useEffect, useState } from 'react';
import UserCreateForm from './UserCreateForm';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [error, setError] = useState<string>(''); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.roles && user.roles.includes('admin-1')) {
      setIsAdmin(true);
    }
  }, []);

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

  const handleUpdateUser = async (user: any) => {
    if (user.tipoUsuarioId < 1 || user.tipoUsuarioId > 4) {
      setError('El ID de tipo de usuario debe estar entre 1 y 4.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      console.log('Usuario actualizado');
      setEditingUser(null);
      fetchUsers(); 
      setError(''); 
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser(user);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Usuarios</h2>
      <div className="mb-4">
        <UserCreateForm onUserCreated={fetchUsers} isAdmin={isAdmin} />
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
              <th scope="col">Nombre Usuario</th>
              <th scope="col">Correo</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Género</th>
              <th scope="col">Rut</th>
              <th scope="col">Fecha Nacimiento</th>
              <th scope="col">Id usuario</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.nombreUsuario}</td>
                  <td>{user.email}</td>
                  <td>{user.telefono}</td>
                  <td>{user.genero}</td>
                  <td>{user.rut}</td>
                  <td>{user.fechaNacimiento}</td>
                  <td>{user.tipoUsuarioId}</td>
                  <td>
                    {isAdmin && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEditClick(user)} 
                      >
                        Editar
                      </button>
                    )}
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

      {isAdmin && editingUser && (
        <div className="mt-4">
          <h3>Editar Usuario</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUser(editingUser);
            }}
          >
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={editingUser.nombre}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, nombre: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="apellido"
                value={editingUser.apellido}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, apellido: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                className="form-control"
                id="telefono"
                value={editingUser.telefono}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, telefono: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="genero">Género</label>
              <input
                type="text"
                className="form-control"
                id="genero"
                value={editingUser.genero}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, genero: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="rut">Rut</label>
              <input
                type="text"
                className="form-control"
                id="rut"
                value={editingUser.rut}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, rut: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-control"
                id="fechaNacimiento"
                value={editingUser.fechaNacimiento}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, fechaNacimiento: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoUsuarioId">ID de Tipo de Usuario</label>
              <input
                type="number"
                className="form-control"
                id="tipoUsuarioId"
                value={editingUser.tipoUsuarioId}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, tipoUsuarioId: parseInt(e.target.value) })
                }
                min={1}
                max={4}
              />
            </div>

            {error && <div className="alert alert-danger mt-2">{error}</div>}

            <button type="submit" className="btn btn-primary mt-3">
              Actualizar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;




