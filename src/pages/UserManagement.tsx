import { useEffect, useState, useCallback } from "react";
import { Tabs, Tab, Button, Spinner, Container, Row, Col, Form, Modal } from "react-bootstrap";
import UserCreateForm from "./UserCreateForm";
import CardUser from "../components/CardUser";
import UserTable from "../components/UserTable";
import { User } from "../types/types";
import CustomPagination from "../components/CustomPagination";
import AdminSideBar from "../components/AdminSideBar";
import UserGreeting from "../components/UserGreeting";
import "../styles/UserManagementStyle.css";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string>(""); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const usersPerPage = 6;
  const [searchId, setSearchId] = useState<number | string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [searchUsername, setSearchUsername] = useState<string>('');
  const [searchEmail, setSearchEmail] = useState<string>('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
      localStorage.setItem("selectedUser", JSON.stringify(filteredUsers[0])); 
    } else {
      alert('Usuario no encontrado');
      setSelectedUser(null);
      localStorage.removeItem("selectedUser");
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

  const fetchUsers = useCallback(async (): Promise<User[]> => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

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
      return data; 
    } catch (err) { 
      console.error("Error:", err);
      if (err instanceof Error) {
        setError("Error al obtener los usuarios: " + err.message);
      } else {
        setError("Error desconocido al obtener los usuarios.");
      }
      return []; 
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdminRole = user.role === "Super Admin";
    setIsAdmin(isAdminRole);
    fetchUsers();
  }, [fetchUsers]);

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

  const deleteUser = useCallback(async (userId: number) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }

      console.log("Usuario eliminado");
      await fetchUsers(); 
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null); 
        localStorage.removeItem("selectedUser"); 
      }
    } catch (err) { 
      console.error("Error al eliminar el usuario:", err);
      if (err instanceof Error) {
        setError("Error al eliminar el usuario: " + err.message);
      } else {
        setError("Error desconocido al eliminar el usuario.");
      }
    }
  }, [API_BASE_URL, fetchUsers, selectedUser]);

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

  const handleUpdateUser = useCallback(async () => {
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
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }
  
      const response = await fetch(`${API_BASE_URL}/usuarios/${editingUser.id}/cambiar-rol`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(requestBody),
      });
  
      const result = await response.json();
      console.log("response:", result);
  
      if (!response.ok) {
        throw new Error(`Error al actualizar el usuario: ${response.status} - ${result.message || "Error desconocido"}`);
      }
  
      console.log("Usuario actualizado correctamente");
      const updatedUsers = await fetchUsers();
      const updatedUser = updatedUsers.find(u => u.id === editingUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser); 
        localStorage.setItem("selectedUser", JSON.stringify(updatedUser)); 
      }
      setEditingUser(null); 
    } catch (err) { 
      console.error("Error al actualizar el usuario:", err);
      if (err instanceof Error) {
        setError("Error al actualizar el usuario. " + err.message);
      } else {
        setError("Error desconocido al actualizar el usuario.");
      }
    }
  }, [API_BASE_URL, fetchUsers, editingUser]);

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
    <Container fluid className="mt-5">
      <Row>
        <Col md={12}>
          <UserGreeting />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <AdminSideBar />
        </Col>

        <Col md={10}>
          <div style={{ marginTop: "1rem", marginBottom: "6rem", padding: "16px", background: "#F5F5F5", borderRadius: "0px 0px 8px 8px" }}>
          <Tabs defaultActiveKey="crearUsuario" className="custom-tabs mb-3">

          <Tab eventKey="crearUsuario" title="Crear Usuario">
            {isAdmin === null ? (
              <Spinner animation="border" />
            ) : isAdmin ? (
              <UserCreateForm onUserCreated={fetchUsers} isAdmin={isAdmin} />
            ) : (
              <p>No tienes permisos para crear usuarios.</p>
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

                    {editingUser && selectedUser ? (
                      <>
                        <CardUser selectedUser={selectedUser} />
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
                                  value={editingUser.fechaNacimiento || ""}
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
                                  value={editingUser.idRol || ""}
                                  onChange={(e) => {
                                    const newIdRol = parseInt(e.target.value, 10);
                                    console.log("Nuevo idRol seleccionado:", newIdRol);
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

      {/* Mostrar Mensajes de Error */}
      {error && <p className="text-danger mt-3">{error}</p>}

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








