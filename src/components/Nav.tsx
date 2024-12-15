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
    <Row>
      <Container className="nav-container">
        <Col md={2}>
          <Navbar.Brand
            as={Link}
            to="/">
          </Navbar.Brand>
        </Col>

        <Col md={12}>
          <Navbar className="custom-navbar">
            <Nav className="main-nav mx-auto d-flex align-items-center">
              <Nav.Link as={Link} to="/" className="nav-link">Inicio</Nav.Link>
              <NavDropdown title="Plantas" id="plantas-dropdown" className="nav-dropdown">
                <NavDropdown.Item as={Link} to="/catalogo">Catálogo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/categorias">Categorías</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Comunidad" id="comunidad-dropdown" className="nav-dropdown">
                <NavDropdown.Item as={Link} to="/foros">Foros</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/eventos">Eventos</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Educación" id="educacion-dropdown" className="nav-dropdown">
                <NavDropdown.Item as={Link} to="/recursos">Recursos</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Asistente Virtual" id="asistente-dropdown" className="nav-dropdown">
                <NavDropdown.Item as={Link} to="/faq">FAQ</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/contacto">Contacto</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar>
        </Col>

        <Col md={3}>
          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                <img
                  src="/path-to-avatar.png"
                  alt="Avatar"
                  className="user-avatar"
                />
                <NavDropdown title={user.username} id="user-dropdown" className="nav-dropdown">
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
                  <NavDropdown.Item onClick={() => {
                    onLogout();
                    navigate("/login");
                    localStorage.removeItem("user");
                  }}>
                    Cerrar sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <Nav.Link as={Link} to="/login" className="login-link">
                Registrarse/Login
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/cart" className="cart-link">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Nav.Link>
          </div>
        </Col>
      </Container>
    </Row>
  );
};

export default CustomNav;