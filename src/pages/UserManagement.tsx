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

    const savedUser = JSON.parse(localStorage.getItem("selectedUser") || "null");
    if (savedUser) {
      const existsInUsers = users.find((u) => u.id === savedUser.id);
      if (existsInUsers) {
        setSelectedUser(savedUser);
      } else {
        localStorage.removeItem("selectedUser");
      }
    }

    fetchUsers();
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

      console.log("Fecha formateada:", formattedFechaNacimiento);

      setEditingUser({
        ...selectedUser,
        fechaNacimiento: formattedFechaNacimiento,
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
      idRol: editingUser.idRol,
    };

    console.log("requestBody preparado:", requestBody);

    try {
      const response = await fetch(`http://localhost:8080/usuarios/${editingUser.id}`, {
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
                          {/* Form rows for editing user */}
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

                          {/* Rest of the form fields... */}

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
                        </Form>
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





