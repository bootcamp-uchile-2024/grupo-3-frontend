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
import AdminSideBar from "../components/AdminSideBar";
import UserGreeting from "../components/UserGreeting";
import "../styles/UserManagementStyle.css"

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const usersPerPage = 6;

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
      const responseData = await response.json();
      console.log("Estructura de responseData:", responseData);
      if (!Array.isArray(responseData.data)) {
        console.error("El campo 'data' no es un array:", responseData.data);
      }

      const data: User[] = Array.isArray(responseData.data) ? responseData.data : [];
      setUsers(data);
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
      const fechaOriginal = selectedUser.fechaNacimiento || "";
      const formattedFechaNacimiento = fechaOriginal.includes("T")
        ? fechaOriginal.split("T")[0] 
        : fechaOriginal; 
  
      setEditingUser({
        ...selectedUser,
        fechaNacimiento: formattedFechaNacimiento,
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
  
    const formattedFechaNacimiento = editingUser.fechaNacimiento?.split("T")[0] || "";
  
    const requestBody = {
     
      nombre: editingUser.nombre,
      apellido: editingUser.apellido,
      contrasena: "defaultPassword123", 
      nombreUsuario: editingUser.nombreUsuario,
      email: editingUser.email,
      telefono: editingUser.telefono,
      genero: editingUser.genero,
      rut: editingUser.rut,
      fechaNacimiento: formattedFechaNacimiento, 
      idRol: editingUser.idRol || null, 
    };
    console.log("requestBody", requestBody)
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const result = await response.json(); 
      console.log("response", result);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al actualizar el usuario: ${response.status} - ${errorData.message || "Error desconocido"}`);
      }
  
      console.log("Usuario actualizado correctamente");
      fetchUsers(); 
      setEditingUser(null); 
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError("Error al actualizar el usuario. Verifica los datos.");
    }
  };
  
  
  const handleSaveChangesClick = () => {
    if (!selectedUser) {
      console.error("No hay un usuario seleccionado para modificar.");
      return; 
    }
    setEditingUser({ ...selectedUser }); 
    setModalAction("modify"); 
    setShowModal(true); 
  };
  

  const handleDeleteUserClick = () => {
    if (!selectedUser) {
      console.error("No hay un usuario seleccionado para eliminar.");
      return;
    }
    setModalAction("delete");
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmAction = () => {
    if (modalAction === "delete" && selectedUser) {
      deleteUser(selectedUser.id); 
    } else if (modalAction === "modify") {
      handleUpdateUser();
    }
    setShowModal(false); 
  };
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(users)
  ? users.slice(indexOfFirstUser, indexOfLastUser)
  : [];


  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const userRoles = [
    { idRol: 1, name: "Super Admin" },
    { idRol: 2, name: "Admin" },
    { idRol: 3, name: "Cliente" },
    { idRol: 4, name: "Visitante" },
  ];


  return (
    <Container fluid className="mt-4" style={{}}>
      <Col md={12}>
        <UserGreeting />
      </Col>
  
      <Row>
        <Col>
          <AdminSideBar />
        </Col>
  
        <Col md={10}>
          <div
            style={{
              marginTop: "10rem",
              padding: "16px",
              background: "#F5F5F5",
              borderRadius: "0px 0px 8px 8px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Tabs defaultActiveKey="modificarUsuario" className="custom-tabs mb-3">
              <Tab eventKey="crearUsuario" title="Crear Usuario">
                {isAdmin && (
                  <UserCreateForm onUserCreated={fetchUsers} isAdmin={isAdmin} />
                )}
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
                      users={Array.isArray(users) ? users : []}
                      currentUsers={Array.isArray(currentUsers) ? currentUsers : []}
                      selectedUser={selectedUser ?? null}
                      setSelectedUser={setSelectedUser}
                    />
  
                    {selectedUser && (
                      <div className="d-flex justify-content-center mt-3 gap-2">
                        <Button variant="secondary" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={handleDeleteUserClick}
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
                                  prev
                                    ? { ...prev, nombre: e.target.value }
                                    : null
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
                                  prev
                                    ? { ...prev, apellido: e.target.value }
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
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                              type="email"
                              value={editingUser.email}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev
                                    ? { ...prev, email: e.target.value }
                                    : null
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
                                  prev
                                    ? { ...prev, telefono: e.target.value }
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
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                              type="text"
                              value={editingUser.nombreUsuario}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev
                                    ? { ...prev, nombreUsuario: e.target.value }
                                    : null
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
                                  prev
                                    ? { ...prev, genero: e.target.value }
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
                            <Form.Label>RUT</Form.Label>
                            <Form.Control
                              type="text"
                              value={editingUser.rut}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev
                                    ? { ...prev, rut: e.target.value }
                                    : null
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
                              value={editingUser.fechaNacimiento || ""}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        fechaNacimiento: e.target.value,
                                      }
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
                                  prev
                                    ? { ...prev, direccion: e.target.value }
                                    : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Tipo de Usuario</Form.Label>
                            <Form.Select
                              value={editingUser?.idRol || ""}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        idRol: parseInt(e.target.value, 10),
                                      }
                                    : null
                                )
                              }
                            >
                              <option value="">Seleccione un tipo de usuario</option>
                              {userRoles.map((role) => (
                                <option key={role.idRol} value={role.idRol}>
                                  {role.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                    <div className="d-flex justify-content-center mt-3 gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setEditingUser(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="success"
                        onClick={handleSaveChangesClick}
                      >
                        Guardar Cambios
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {selectedUser ? (
                      <CardUser selectedUser={selectedUser} />
                    ) : (
                      <p>No hay un usuario seleccionado</p>
                    )}
                    <UserTable
                      users={Array.isArray(users) ? users : []}
                      currentUsers={
                        Array.isArray(currentUsers) ? currentUsers : []
                      }
                      selectedUser={selectedUser ?? null}
                      setSelectedUser={setSelectedUser}
                    />
                    <div
                      className="d-flex justify-content-center mt-3 gap-2"
                      style={{ position: "relative" }}
                    >
                      <Button
                        variant="primary"
                        onClick={handleModifyClick}
                        disabled={!selectedUser}
                        className="btn-modify-position"
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
  
      {/* Modal Dinámico */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        style={{ padding: "32px 41px 24px 41px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === "modify"
              ? "¿Está Seguro de Modificar el Usuario?"
              : "¿Está Seguro de Eliminar el Usuario?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalAction === "modify"
              ? "Esta acción no podrá deshacerse"
              : "Esta acción no podrá deshacerse y el usuario será eliminado permanentemente."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalAction === "modify" ? "success" : "danger"}
            onClick={handleConfirmAction}
          >
            {modalAction === "modify" ? "Modificar" : "Eliminar"}
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
  
};

export default UserManagement;





