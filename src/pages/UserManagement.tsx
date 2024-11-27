import { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Pagination,
} from 'react-bootstrap';
import UserCreateForm from './UserCreateForm';
import CardUser from '../components/CardUser';
import UserTable from '../components/UserTable';

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
  direccion?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.roles && user.roles.includes('admin-1')) {
      setIsAdmin(true);
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/usuarios');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data: User[] = await response.json();
      setUsers(data);
      setSelectedUser(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al obtener los usuarios');
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
      setError('Error al eliminar el usuario');
    }
  };

  const handleUpdateUser = async (user: User) => {
    const tipoUsuarioId = parseInt(user.tipoUsuarioId.toString(), 10);

    if (isNaN(tipoUsuarioId) || tipoUsuarioId < 1 || tipoUsuarioId > 4) {
      setError('El ID de tipo de usuario debe estar entre 1 y 4.');
      return;
    }

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
      setError('Error al actualizar el usuario');
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={2} className="d-flex flex-column gap-2">
          {['Usuarios', 'Productos', 'Seguimiento', 'Métricas', 'Comunidad'].map((text, index) => (
            <Button
              key={index}
              variant="light"
              className="d-flex align-items-center"
              style={{
                height: '48px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#D3DBD5',
              }}
            >
              {text}
            </Button>
          ))}
        </Col>
        <Col md={10}>
          <h1 className="text-end">¡Buenos días Admin!</h1>

          {error && <p className="text-danger">{error}</p>}

          <Tabs defaultActiveKey="modificarUsuario" className="mb-3">
            {/* Pestaña Crear Usuario */}
            <Tab eventKey="crearUsuario" title="Crear Usuario">
              {isAdmin && (
                <UserCreateForm onUserCreated={fetchUsers} isAdmin={isAdmin} />
              )}
            </Tab>

            {/* Pestaña Eliminar Usuario */}
            <Tab eventKey="eliminarUsuario" title="Eliminar Usuario">
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {selectedUser && (
                    <CardUser
                      selectedUser={{
                        ...selectedUser,
                        direccion: selectedUser.direccion || 'Sin dirección', // Añadimos un valor por defecto
                      }}
                    />
                  )}
                  <UserTable
                    users={users}
                    currentUsers={currentUsers}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                  />
                  <Pagination className="justify-content-center mt-3">
                    {Array.from(
                      { length: Math.ceil(users.length / usersPerPage) },
                      (_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={index + 1 === currentPage}
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      )
                    )}
                  </Pagination>
                  {selectedUser && (
                    <div className="d-flex justify-content-center mt-3 gap-2">
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                      <Button variant="danger" onClick={() => deleteUser(selectedUser.id)}>
                        Eliminar
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Tab>

            {/* Pestaña Modificar Usuario */}
            <Tab eventKey="modificarUsuario" title="Modificar Usuario">
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {selectedUser && <CardUser selectedUser={selectedUser} />}
                  <UserTable
                    users={users}
                    currentUsers={currentUsers}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                  />
                  <Pagination className="justify-content-center mt-3">
                    {Array.from(
                      { length: Math.ceil(users.length / usersPerPage) },
                      (_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={index + 1 === currentPage}
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      )
                    )}
                  </Pagination>
                  {editingUser && (
                    <div className="d-flex justify-content-center mt-3 gap-2">
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                      <Button variant="primary" onClick={() => handleUpdateUser(editingUser)}>
                        Modificar
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default UserManagement;


