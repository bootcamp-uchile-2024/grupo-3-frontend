import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/CustomNav.css";

interface TopBarProps {
  user: { username: string; role: string } | null;
  onLogout: () => void;
  cartItemCount: number;
}

const CustomNav: React.FC<TopBarProps> = ({ user, onLogout, cartItemCount }) => {
  const navigate = useNavigate();
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Navbar>
              <Navbar.Brand
                as={Link}
                to="/">
              </Navbar.Brand>
              <div className="d-flex align-items-center justify-content-end gap-3" style={{ position: "relative", top:"2rem", left: "66rem" }}>
                {user ? (
                  <NavDropdown
                    title={`Hola, ${user.username}`}
                    id="user-dropdown"
                  >
                    {user.role === "admin" && (
                      <>
                        <NavDropdown.Item as={Link} to="/crear-producto">
                          Crear Producto
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/user-management">
                          Gestión de Usuarios
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin-carts">
                          Gestión de Carritos
                        </NavDropdown.Item>
                      </>
                    )}
                    <NavDropdown.Item
                      onClick={() => {
                        alert("Has cerrado sesión.");
                        onLogout();
                        navigate("/login");
                        localStorage.removeItem("user");
                      }}
                    >
                      Cerrar sesión
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                )}

                <Nav.Link as={Link} to="/cart" className="position-relative">
                  <span className="material-symbols-outlined icon-dark">garden_cart</span>
                  {cartItemCount > 0 && (
                    <span className="cart-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartItemCount}
                    </span>
                  )}
                </Nav.Link>
              </div>
            </Navbar>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Navbar>
              <Nav style={{position: "relative", top:"3rem", left: "20rem", gap: "1.5rem" }}>
                <Nav.Link as={Link} to="/">
                <span className="text-text1-regular">Inicio</span>
                </Nav.Link>
                <NavDropdown
                  title={<span>Plantas</span>}
                  id="plantas-dropdown" className="text-text1-regular">
                  <NavDropdown.Item as={Link} to="/catalogo">
                    Catálogo
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/categorias">
                    Categorías
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/checkout-invitado">
                    Checkout Invitado
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={<span>Comunidad</span>}
                  id="comunidad-dropdown" className="text-text1-regular"
                >
                  <NavDropdown.Item as={Link} to="/foros">
                    Foros
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/eventos">
                    Eventos
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={<span>Educación</span>}
                  id="educacion-dropdown" className="text-text1-regular"
                >
                  <NavDropdown.Item as={Link} to="/style-guide">
                    Guía de Estilo
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/recursos">
                    Recursos
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={<span>Asistente Virtual</span>}
                  id="asistente-dropdown" className="text-text1-regular"
                >
                  <NavDropdown.Item as={Link} to="/faq">
                    FAQ
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/contacto">
                    Contacto
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CustomNav;
