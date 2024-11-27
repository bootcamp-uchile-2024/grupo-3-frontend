import { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Table,
  Button,
  Spinner,
  Card,
  Container,
  Row,
  Col,
  Pagination,
} from 'react-bootstrap';
import UserCreateForm from './UserCreateForm';

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
      setSelectedUser(data[0]);
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
        {/* Sidebar */}
        <Col md={2} className="d-flex flex-column gap-2">
          <Button
            variant="light"
            className="d-flex align-items-center"
            style={{
              height: '48px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#D3DBD5',
            }}
          >
            Usuarios
          </Button>
          <Button
            variant="light"
            className="d-flex align-items-center"
            style={{
              height: '48px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#D3DBD5',
            }}
          >
            Productos
          </Button>
          <Button
            variant="light"
            className="d-flex align-items-center"
            style={{
              height: '48px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#D3DBD5',
            }}
          >
            Seguimiento
          </Button>
          <Button
            variant="light"
            className="d-flex align-items-center"
            style={{
              height: '48px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#D3DBD5',
            }}
          >
            Métricas
          </Button>
          <Button
            variant="light"
            className="d-flex align-items-center"
            style={{
              height: '48px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#D3DBD5',
            }}
          >
            Comunidad
          </Button>
        </Col>
  
        {/* Contenido principal */}
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
                  {/* Card del usuario seleccionado */}
                  {selectedUser && (
                    <Card className="mb-4">
                      <Card.Body className="d-flex align-items-center">
                        <img
                          src="https://via.placeholder.com/100"
                          alt="Usuario"
                          className="rounded-circle me-3"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <div>
                          <Card.Title>{`${selectedUser.nombre} ${selectedUser.apellido}`}</Card.Title>
                          <Card.Text>
                            <p>
                              <strong>Teléfono:</strong> {selectedUser.telefono}
                            </p>
                            <p>
                              <strong>Email:</strong> {selectedUser.email}
                            </p>
                            <p>
                              <strong>Dirección:</strong> {selectedUser.direccion}
                            </p>
                            <p>
                              <strong>ID Usuario:</strong> {selectedUser.tipoUsuarioId}
                            </p>
                          </Card.Text>
                        </div>
                      </Card.Body>
                    </Card>
                  )}
  
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
                        <th>Acción</th>
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
                          <td>{user.direccion}</td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUser(user.id);
                              }}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
  
                  {/* Paginación */}
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
                </>
              )}
            </Tab>
  
            {/* Pestaña Modificar Usuario */}
            <Tab eventKey="modificarUsuario" title="Modificar Usuario">
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {/* Card del usuario seleccionado */}
                  {selectedUser && (
                    <Card className="mb-4">
                      <Card.Body className="d-flex align-items-center">
                        <img
                          src="https://via.placeholder.com/100"
                          alt="Usuario"
                          className="rounded-circle me-3"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <div>
                          <Card.Title>{`${selectedUser.nombre} ${selectedUser.apellido}`}</Card.Title>
                          <Card.Text>
                            <p>
                              <strong>Teléfono:</strong> {selectedUser.telefono}
                            </p>
                            <p>
                              <strong>Email:</strong> {selectedUser.email}
                            </p>
                            <p>
                              <strong>Dirección:</strong> {selectedUser.direccion}
                            </p>
                            <p>
                              <strong>ID Usuario:</strong> {selectedUser.tipoUsuarioId}
                            </p>
                          </Card.Text>
                        </div>
                      </Card.Body>
                    </Card>
                  )}
  
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
                          <td>{user.direccion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
  
                  {/* Botones Editar y Cancelar */}
                  {editingUser && (
                    <Row className="mt-3">
                      <Col className="d-flex justify-content-end">
                        <Button
                          variant="secondary"
                          className="me-2"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => editingUser && handleUpdateUser(editingUser)}
                        >
                          Modificar
                        </Button>
                      </Col>
                    </Row>
                  )}
  
                  {/* Paginación */}
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





