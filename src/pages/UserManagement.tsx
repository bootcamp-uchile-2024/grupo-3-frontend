import { useEffect, useState } from 'react';
import UserCreateForm from './UserCreateForm';
import { Table, Button, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  email: string;
  telefono: string;
  genero: string;
  rut: string;
  fechaNacimiento: string;
  tipoUsuarioId: number | string;
  tipoUsuario: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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
      const data: User[] = await response.json();
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
        throw new Error('Error al eliminar el usuario-');
      }
      console.log('Usuario eliminado');
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleUpdateUser = async (user: User) => {
    const tipoUsuarioId = parseInt(user.tipoUsuarioId.toString(), 10);

    if (isNaN(tipoUsuarioId) || tipoUsuarioId < 1 || tipoUsuarioId > 4) {
      setError('El ID de tipo de usuario debe estar entre 1 y 4.');
      return;
    }

    console.log('Validación correcta, enviando datos:', user);

    try {
      const response = await fetch(`http://localhost:8080/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...user, tipoUsuarioId }),
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

  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null); 
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-left" style={{ color: '#264653', fontWeight: 'bold' }}>Gestión de Usuarios</h2>
        <div>
          <h4 style={{ color: '#264653' }}>¡Buenos días Admin!</h4>
        </div>
      </div>
  
      <div className="d-flex">
        {/* Menú lateral */}
        <Card style={{ width: '200px', marginRight: '16px', borderRadius: '8px' }}>
          <Card.Body className="p-3">
            <Link to="/usuarios" className="btn btn-outline-dark w-100 mb-2" style={{ borderRadius: '8px' }}>
              <i className="bi bi-people-fill me-2"></i> Usuarios
            </Link>
            <Link to="/productos" className="btn btn-outline-dark w-100 mb-2" style={{ borderRadius: '8px' }}>
              <i className="bi bi-box-seam me-2"></i> Productos
            </Link>
            <Link to="/seguimiento" className="btn btn-outline-dark w-100 mb-2" style={{ borderRadius: '8px' }}>
              <i className="bi bi-graph-up-arrow me-2"></i> Seguimiento
            </Link>
            <Link to="/comunidad" className="btn btn-outline-dark w-100" style={{ borderRadius: '8px' }}>
              <i className="bi bi-people me-2"></i> Comunidad
            </Link>
          </Card.Body>
        </Card>
  
        {/* Tabla de usuarios */}
        <div className="flex-grow-1">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <Table hover responsive className="table-striped align-middle">
              <thead style={{ backgroundColor: '#264653', color: '#FFF' }}>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Nombre Usuario</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Género</th>
                  <th>Rut</th>
                  <th>Fecha Nacimiento</th>
                  <th>Tipo de Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.nombreUsuario}</td>
                    <td>{user.email}</td>
                    <td>{user.telefono}</td>
                    <td>{user.genero}</td>
                    <td>{user.rut}</td>
                    <td>{new Date(user.fechaNacimiento).toLocaleDateString('es-ES')}</td>
                    <td>{user.tipoUsuario}</td>
                    <td>
                      {isAdmin && (
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(user)}
                        >
                          Editar
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
  
      {/* Formulario de edición de usuario */}
      {isAdmin && editingUser && (
        <div className="mt-4">
          <h3 style={{ color: '#264653', fontWeight: 'bold' }}>Editar Usuario</h3>
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
            {/* Reutilización del resto de tus campos de edición */}
            <button type="submit" className="btn btn-primary mt-3">
              Actualizar
            </button>
            <button
              type="button"
              className="btn btn-secondary mt-3 ms-2"
              onClick={handleCancelEdit}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </Container>
  );
}  

export default UserManagement;


