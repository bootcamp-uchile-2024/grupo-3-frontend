import { useEffect, useState } from "react";
import { Tabs, Tab, Button, Spinner, Container, Row, Col, Form, Modal } from "react-bootstrap";
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
  const [searchId, setSearchId] = useState<number | string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [searchUsername, setSearchUsername] = useState<string>('');
  const [searchEmail, setSearchEmail] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLElement>, field: string) => {
    const value = (event.target as HTMLInputElement).value;
    switch (field) {
      case 'id':
        setSearchId(value);
        break;
      case 'name':
        setSearchName(value);
        break;
      case 'username':
        setSearchUsername(value);
        break;
      case 'email':
        setSearchEmail(value);
        break;
      default:
        break;
    }
  };

  const handleSearchSubmit = () => {
    const filteredUsers = users.filter((user) => {
      const matchId = searchId ? user.id === Number(searchId) : true;
      const matchName = searchName ? user.nombre.toLowerCase().includes(searchName.toLowerCase()) : true;
      const matchUsername = searchUsername ? user.nombreUsuario.toLowerCase().includes(searchUsername.toLowerCase()) : true;
      const matchEmail = searchEmail ? user.email.toLowerCase().includes(searchEmail.toLowerCase()) : true;
      return matchId && matchName && matchUsername && matchEmail;
    });

    if (filteredUsers.length > 0) {
      setSelectedUser(filteredUsers[0]);
    } else {
      alert('Usuario no encontrado');
      setSelectedUser(null);
    }
  };

  const isFieldDisabled = (field: string) => { 
    
    switch (field) {
      case 'id':
        return !!searchName || !!searchUsername || !!searchEmail;
      case 'name':
        return !!searchId || !!searchUsername || !!searchEmail;
      case 'username':
        return !!searchId || !!searchName || !!searchEmail;
      case 'email':
        return !!searchId || !!searchName || !!searchUsername;
      default:
        return false;
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.roles && user.roles.includes("admin-1")) {
      setIsAdmin(true);
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("selectedUser") || "null");
    if (savedUser) {
      const existsInUsers = users.find((u) => u.id === savedUser.id);
      if (existsInUsers) {
        setSelectedUser(savedUser);
      } else {
        localStorage.removeItem("selectedUser");
      }
    }
  }, [users]); 

  const handleSetSelectedUser = (user: User | null) => {
    if (user?.id === selectedUser?.id) return;
    setSelectedUser(user); 
    if (user) {
      localStorage.setItem("selectedUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("selectedUser");
    }
  };

  const fetchUsers = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${backendUrl}/usuarios`);
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
      console.log("Usuarios actualizados en el estado:", data);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al obtener los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${backendUrl}/usuarios/${userId}`, {
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

      console.log("Fecha formateada:", formattedFechaNacimiento);

      setEditingUser({
        ...selectedUser,
        idRol: selectedUser.idRol,
      });
      setModalAction("modify");

    }
  };

  const handleUpdateUser = async () => {
    console.log("handleUpdateUser llamada");
    if (!editingUser) return;

    if (editingUser.idRol === null || editingUser.idRol === undefined) {
      console.error("idRol no está definido para el usuario que se va a actualizar.");
      setError("El rol del usuario es obligatorio.");
      return;
    }


    const requestBody = {
      idRol: editingUser.idRol,
    };

    console.log("requestBody preparado:", requestBody);

    try {
      const backendUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${backendUrl}/usuarios/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("response:", result);

      if (!response.ok) {
        throw new Error(`Error al actualizar el usuario: ${response.status} - ${result.message || "Error desconocido"}`);
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
    if (!editingUser) {
      console.error("No hay un usuario seleccionado para modificar.");
      return;
    }
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
    console.log(`Confirmando acción: ${modalAction}`);
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
    <Container fluid className="mt-4">
      <Row>
        <Col md={12}>
          <UserGreeting />
        </Col>
      </Row>
      <Row>
        <Col>
          <AdminSideBar />
        </Col>

        <Col md={10}>
          <div style={{ marginTop: "1rem", marginBottom: "6rem", padding: "16px", background: "#F5F5F5", borderRadius: "0px 0px 8px 8px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}>
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
                      currentUsers={currentUsers}
                      selectedUser={selectedUser}
                      setSelectedUser={handleSetSelectedUser}
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
                ) : (
                  <>
                    <Row className="mb-4">
                      <Col md={3}>
                        <Form.Label>Buscar por Nombre</Form.Label>
                        <Form className="d-flex">
                          <Form.Control
                            type="text"
                            placeholder="Nombre"
                            value={searchName}
                            onChange={(e) => handleSearchChange(e, 'name')}
                            disabled={isFieldDisabled('name')}
                          />
                        </Form>
                      </Col>
                      <Col md={3}>
                        <Form.Label>Buscar por Username</Form.Label>
                        <Form className="d-flex">
                          <Form.Control
                            type="text"
                            placeholder="Username"
                            value={searchUsername}
                            onChange={(e) => handleSearchChange(e, 'username')}
                            disabled={isFieldDisabled('username')}
                          />
                        </Form>
                      </Col>
                      <Col md={3}>
                        <Form.Label>Buscar por Email</Form.Label>
                        <Form className="d-flex">
                          <Form.Control
                            type="text"
                            placeholder="Email"
                            value={searchEmail}
                            onChange={(e) => handleSearchChange(e, 'email')}
                            disabled={isFieldDisabled('email')}
                          />
                        </Form>
                      </Col>
                      <Col md={3}>
                        <Form.Label>Buscar por ID</Form.Label>
                        <Form className="d-flex">
                          <Form.Control
                            type="number"
                            placeholder="ID"
                            value={searchId}
                            onChange={(e) => handleSearchChange(e, 'id')}
                            disabled={isFieldDisabled('id')}
                          />
                        </Form>
                      </Col>
                      <Col md={2}>
                        <Button
                          onClick={handleSearchSubmit}
                          variant="primary"
                          className="botonbuscador mt-4"
                        >
                          Buscar
                        </Button>
                      </Col>
                    </Row>

                    {editingUser ? (
                      <>
                        <CardUser selectedUser={editingUser} />
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
                                  disabled
                                />
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group controlId="formFechaNacimiento">
                                <Form.Label>Fecha de Nacimiento</Form.Label>
                                <Form.Control
                                  type="date"
                                  value={editingUser?.fechaNacimiento || ""}
                                  onChange={(e) => {
                                    if (editingUser) {
                                      setEditingUser({
                                        ...editingUser,
                                        fechaNacimiento: e.target.value,
                                      });
                                    } else {
                                      console.error("No hay un usuario seleccionado para actualizar la fecha de nacimiento.");
                                    }
                                  }}
                                  disabled
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
                                  disabled
                                />
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group>
                                <Form.Label>Tipo de Usuario</Form.Label>
                                <Form.Select
                                  value={editingUser?.idRol || ""}
                                  onChange={(e) => {
                                    const newIdRol = parseInt(e.target.value, 10);
                                    console.log("Nuevo idRol seleccionado:", newIdRol); // Verificación
                                    if (editingUser) {
                                      setEditingUser({
                                        ...editingUser,
                                        idRol: newIdRol,
                                      });
                                    }
                                  }}
                                  required
                                >
                                  <option value="">Seleccione tipo de usuario</option>
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
                          currentUsers={currentUsers}
                          selectedUser={selectedUser}
                          setSelectedUser={handleSetSelectedUser}
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
                  </>
                )}
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>

      {/* Modal */}
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
              ? "Por favor confirme si desea actualizar información"
              : "Esta acción no podrá deshacerse y el usuario será eliminado permanentemente."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmAction}>
            {modalAction === "modify" ? "Modificar" : "Eliminar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;






