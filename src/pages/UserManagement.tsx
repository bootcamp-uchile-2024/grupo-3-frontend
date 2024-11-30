import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import UserCreateForm from "./UserCreateForm";
import CardUser from "../components/CardUser";
import UserTable from "../components/UserTable";
import { User } from "../types/types";
import CustomPagination from "../components/CustomPagination";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const usersPerPage = 5;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.roles && user.roles.includes("admin-1")) {
      setIsAdmin(true);
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/usuarios");
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const data: User[] = await response.json();
      setUsers(data);
      setSelectedUser(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al obtener los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }
      console.log("Usuario eliminado");
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setError("Error al eliminar el usuario");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleModifyClick = () => {
    if (selectedUser) {
      setEditingUser({ ...selectedUser });
    }
  };


  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingUser),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }

      console.log("Usuario actualizado");
      fetchUsers();
      setEditingUser(null);
      setError("");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError("Error al actualizar el usuario");
    }
  };

  const handleSaveChangesClick = () => {
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  const handleConfirmSaveChanges = () => {
    handleUpdateUser(); 
    setShowModal(false); 
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container fluid className="mt-4" style={{}}>
      <Row>
              <Col md={2} className="d-flex flex-column gap-2" style={{ marginTop: '180px' }}>
          {[
            { text: 'Usuarios', icon: (
              <span className="material-symbols-outlined" style={{color: '#1A4756'}}>
              group
              </span>
              )
            },
            { text: 'Productos', icon: (<span className="material-symbols-outlined" style={{color: '#1A4756'}}>
              redeem
              </span>)},
            { text: 'Seguimiento', icon: (<span className="material-symbols-outlined" style={{color: '#1A4756'}}>
              airport_shuttle
              </span>) },
            { text: 'Métricas', icon: (<span className="material-symbols-outlined" style={{color: '#1A4756'}}>
              graphic_eq
              </span>) },
            { text: 'Comunidad', icon: (<span className="material-symbols-outlined" style={{color: '#1A4756'}}>
              group_work
              </span>) },
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
  <div 
    className="d-flex align-items-center justify-content-end" 
    style={{ marginRight: '84px', gap: '18px' }}
  >
    <img 
      src="https://ui-avatars.com/api/?name=Admin&background=1A4756&color=fff&size=128" 
      alt="Perfil Admin" 
      style={{
        width: '64px', 
        height: '64px',
        borderRadius: '50%', 
        objectFit: 'cover', 
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' 
      }} 
    />
    <h1 
      className="text-end" 
      style={{
        fontFamily: 'Quicksand',
        fontSize: '30px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '52px',
        color: '#1A4756',
        margin: 0 
      }}
    >
      ¡Buenos días Admin!
    </h1>
  </div>
  <p style={{ marginRight: '84px' }}>Administrador/Usuarios/Modificar Usuarios</p>

  {error && <p className="text-danger">{error}</p>}

  <div>

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
                    direccion: selectedUser.direccion || "Sin dirección",
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
                  <Button
                    variant="danger"
                    onClick={() => deleteUser(selectedUser.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              )}
            </>
          )}

<CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(users.length / usersPerPage)}
            paginate={paginate}
          />
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
                            prev
                              ? { ...prev, fechaNacimiento: e.target.value }
                              : null
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
                        value={editingUser.direccion || ""}
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
                            prev
                              ? {
                                  ...prev,
                                  tipoUsuarioId: parseInt(e.target.value, 10) || 0,
                                }
                              : null
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div className="d-flex justify-content-center mt-3 gap-2">
                <Button variant="secondary" onClick={() => setEditingUser(null)}>
                  Cancelar
                </Button>
                <Button variant="success" onClick={handleSaveChangesClick}>
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
              <div className="d-flex justify-content-end mt-3 gap-2">
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

            {/* Modal de confirmación */}
            <Modal show={showModal} onHide={handleCloseModal} centered style={{padding: '32px 41px 24px 41px'}}>
            <Modal.Header closeButton style={{ borderBottom: "none", textAlign: "center", alignSelf:'stretch'}}>
        <Modal.Title
          style={{
            color: "var(--Color1, #1A4756)",
            fontFamily: "Quicksand",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: '700',
            lineHeight: "30px",
            borderTop: '200px'
          }}
        >
          ¿Está Seguro de Modificar el 
          Usuario?
        </Modal.Title>
      </Modal.Header>

        <Modal.Body
        style={{
          textAlign: "center",
          color: "var(--Color1, #1A4756)",
          fontFamily: "Quicksand",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "22px",
        }}
      >
        <p>Esta acción no podrá deshacerse</p>
      </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button
            variant="success"
            onClick={handleConfirmSaveChanges}
            style={{ backgroundColor: "#1A4756" }}
          >
            Modificar
          </Button>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            style={{ color: "#1A4756", backgroundColor: "#fff" }}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default UserManagement;










