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
  Form,
} from 'react-bootstrap';
import UserCreateForm from './UserCreateForm';
import CardUser from '../components/CardUser';
import UserTable from '../components/UserTable';
import { User } from '../types/types';

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

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`http://localhost:8080/usuarios/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      console.log('Usuario actualizado');
      fetchUsers();
      setEditingUser(null);
      setError('');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      setError('Error al actualizar el usuario');
    }
  };

  const handleModifyClick = () => {
    if (selectedUser) {
      setEditingUser({ ...selectedUser });
    }
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
            <Tab eventKey="crearUsuario" title="Crear Usuario">
              {isAdmin && <UserCreateForm onUserCreated={fetchUsers} isAdmin={isAdmin} />}
            </Tab>

            <Tab eventKey="eliminarUsuario" title="Eliminar Usuario">
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {selectedUser && (
                    <CardUser
                      selectedUser={{
                        ...selectedUser,
                        direccion: selectedUser.direccion || 'Sin dirección',
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

            <Tab eventKey="modificarUsuario" title="Modificar Usuario">
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : editingUser ? (
                <>
                  {editingUser && <CardUser selectedUser={editingUser} />}
                  <Form>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control
                            type="text"
                            value={editingUser.nombre}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, nombre: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Apellido</Form.Label>
                          <Form.Control
                            type="text"
                            value={editingUser.apellido}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, apellido: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>Correo Electrónico</Form.Label>
                          <Form.Control
                            type="email"
                            value={editingUser.email}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, email: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Teléfono</Form.Label>
                          <Form.Control
                            type="text"
                            value={editingUser.telefono}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, telefono: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>Nombre de Usuario</Form.Label>
                          <Form.Control
                            type="text"
                            value={editingUser.nombreUsuario}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, nombreUsuario: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Género</Form.Label>
                          <Form.Control
                            type="text"
                            value={editingUser.genero}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, genero: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>RUT</Form.Label>
                          <Form.Control
                            type="text"
                            value={editingUser.rut}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, rut: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Fecha de Nacimiento</Form.Label>
                          <Form.Control
                            type="date"
                            value={editingUser.fechaNacimiento}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, fechaNacimiento: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>Dirección</Form.Label>
                          <Form.Control
                            type="text"
                            value={editingUser.direccion || ''}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, direccion: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Tipo de Usuario</Form.Label>
                          <Form.Control
                            type="number"
                            value={editingUser.tipoUsuarioId}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, tipoUsuarioId: e.target.value } : null
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                  <div className="d-flex justify-content-center mt-3 gap-2">
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                    <Button variant="success" onClick={handleUpdateUser}>
                      Guardar Cambios
                    </Button>
                  </div>
                </>
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
                  <div className="d-flex justify-content-center mt-3 gap-2">
                    <Button
                      variant="primary"
                      onClick={handleModifyClick}
                      disabled={!selectedUser}
                    >
                      Modificar
                    </Button>
                  </div>
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










