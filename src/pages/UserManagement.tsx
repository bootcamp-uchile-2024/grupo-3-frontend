import { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Form,
} from 'react-bootstrap';
import UserCreateForm from './UserCreateForm';
import CardUser from '../components/CardUser';
import UserTable from '../components/UserTable';
import { User } from '../types/types';
import CustomPagination from '../components/CustomPagination';


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
    <Container fluid className="mt-4" style={{}}>
      <Row>
              <Col md={2} className="d-flex flex-column gap-2" style={{ marginTop: '83px' }}>
          {[
            { text: 'Usuarios', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g clipPath="url(#clip0_3706_23838)">
                    <path d="M11.9902 2C6.47023 2 1.99023 6.48 1.99023 12C1.99023 17.52 6.47023 22 11.9902 22C17.5102 22 21.9902 17.52 21.9902 12C21.9902 6.48 17.5102 2 11.9902 2ZM15.6002 8.34C16.6702 8.34 17.5302 9.2 17.5302 10.27C17.5302 11.34 16.6702 12.2 15.6002 12.2C14.5302 12.2 13.6702 11.34 13.6702 10.27C13.6602 9.2 14.5302 8.34 15.6002 8.34ZM9.60023 6.76C10.9002 6.76 11.9602 7.82 11.9602 9.12C11.9602 10.42 10.9002 11.48 9.60023 11.48C8.30023 11.48 7.24023 10.42 7.24023 9.12C7.24023 7.81 8.29024 6.76 9.60023 6.76ZM9.60023 15.89V19.64C7.20023 18.89 5.30023 17.04 4.46023 14.68C5.51023 13.56 8.13023 12.99 9.60023 12.99C10.1302 12.99 10.8002 13.07 11.5002 13.21C9.86023 14.08 9.60023 15.23 9.60023 15.89ZM11.9902 20C11.7202 20 11.4602 19.99 11.2002 19.96V15.89C11.2002 14.47 14.1402 13.76 15.6002 13.76C16.6702 13.76 18.5202 14.15 19.4402 14.91C18.2702 17.88 15.3802 20 11.9902 20Z" fill="#1A4756"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_3706_23838">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              )
            },
            { text: 'Productos', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g clip-path="url(#clip0_3706_29457)">
                <path d="M20 6H17.82C17.93 5.69 18 5.35 18 5C18 3.34 16.66 2 15 2C13.95 2 13.04 2.54 12.5 3.35L12 4.02L11.5 3.34C10.96 2.54 10.05 2 9 2C7.34 2 6 3.34 6 5C6 5.35 6.07 5.69 6.18 6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM15 4C15.55 4 16 4.45 16 5C16 5.55 15.55 6 15 6C14.45 6 14 5.55 14 5C14 4.45 14.45 4 15 4ZM9 4C9.55 4 10 4.45 10 5C10 5.55 9.55 6 9 6C8.45 6 8 5.55 8 5C8 4.45 8.45 4 9 4ZM20 19H4V17H20V19ZM20 14H4V8H9.08L7 10.83L8.62 12L11 8.76L12 7.4L13 8.76L15.38 12L17 10.83L14.92 8H20V14Z" fill="#1A4756"/>
              </g>
              <defs>
                <clipPath id="clip0_3706_29457">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>) },
            { text: 'Seguimiento', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g clip-path="url(#clip0_3706_29328)">
                <path d="M17 5H3C1.9 5 1 5.89 1 7V16H3C3 17.65 4.34 19 6 19C7.66 19 9 17.65 9 16H14.5C14.5 17.65 15.84 19 17.5 19C19.16 19 20.5 17.65 20.5 16H23V11L17 5ZM3 11V7H7V11H3ZM6 17.5C5.17 17.5 4.5 16.83 4.5 16C4.5 15.17 5.17 14.5 6 14.5C6.83 14.5 7.5 15.17 7.5 16C7.5 16.83 6.83 17.5 6 17.5ZM13 11H9V7H13V11ZM17.5 17.5C16.67 17.5 16 16.83 16 16C16 15.17 16.67 14.5 17.5 14.5C18.33 14.5 19 15.17 19 16C19 16.83 18.33 17.5 17.5 17.5ZM15 11V7H16L20 11H15Z" fill="#1A4756"/>
              </g>
              <defs>
                <clipPath id="clip0_3706_29328">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>) },
            { text: 'Métricas', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g clip-path="url(#clip0_3706_17947)">
                <path d="M7 18H9V6H7V18ZM11 22H13V2H11V22ZM3 14H5V10H3V14ZM15 18H17V6H15V18ZM19 10V14H21V10H19Z" fill="#1A4756"/>
              </g>
              <defs>
                <clipPath id="clip0_3706_17947">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>) },
            { text: 'Comunidad', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g clip-path="url(#clip0_3706_12622)">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 17.5C6.62 17.5 5.5 16.38 5.5 15C5.5 13.62 6.62 12.5 8 12.5C9.38 12.5 10.5 13.62 10.5 15C10.5 16.38 9.38 17.5 8 17.5ZM9.5 8C9.5 6.62 10.62 5.5 12 5.5C13.38 5.5 14.5 6.62 14.5 8C14.5 9.38 13.38 10.5 12 10.5C10.62 10.5 9.5 9.38 9.5 8ZM16 17.5C14.62 17.5 13.5 16.38 13.5 15C13.5 13.62 14.62 12.5 16 12.5C17.38 12.5 18.5 13.62 18.5 15C18.5 16.38 17.38 17.5 16 17.5Z" fill="#1A4756"/>
              </g>
              <defs>
                <clipPath id="clip0_3706_12622">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>) },
          ].map(({ text, icon }, index) => (
            <Button
              key={index}
              variant="light"
              className="d-flex align-items-center gap-2"
              style={{
                height: '48px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: text === 'Usuarios' ? '#D3DBD5' : 'transparent',
                color: text === 'Usuarios' ? '#000' : '#555',
                border: text === 'Usuarios' ? 'none' : '1px solid transparent',
              }}
            >
              {icon && <span>{icon}</span>}
              {text}
            </Button>
          ))}
        </Col>


        <Col md={10}>
          <h1 className="text-end" style={{
            fontFamily: 'Quicksand',
            fontSize: '30px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '52px',
            color: '#1A4756',
            marginRight: '84px'
          }}>¡Buenos días Admin!</h1>
          <p>Administrador/Usuarios/Modificar Usuarios</p>
  
          {error && <p className="text-danger">{error}</p>}
  
          <div
            style={{
              width: '1096px',
              height: '1130px',
              flexShrink: 0,
              borderRadius: '0px 0px 8px 8px',
              background: '#F5F5F5',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              padding: '16px',
              marginTop: '10rem',
            }}
          >
            <Tabs defaultActiveKey="modificarUsuario" className="custom-tabs mb-3">
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
                                  prev ? { ...prev, tipoUsuarioId: parseInt(e.target.value, 10) || 0 } : null
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
                <CustomPagination
  currentPage={currentPage}
  totalPages={Math.ceil(users.length / usersPerPage)}
  paginate={paginate}
/>

              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </Container>
  );
  
};

export default UserManagement;










