import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../styles/CustomNav.css';

const CustomNav: React.FC = () => {
  const navigate = useNavigate();
  const { auth, cartItemCount, logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert("Has cerrado sesión.");
    navigate("/login");
  };

  return (
    <Container fluid className="nav-container">
      <Row className="header-row">
        <Col md={12}>
          <Navbar expand="lg" className="top-navbar">
            <Link to="/" className="navbar-brand" />
            <div className="nav-controls">
              <div className="auth-controls">
                {auth.isAuthenticated && auth.user ? (
                  <NavDropdown
                    title={`Hola, ${auth.user.username}`}
                    id="user-dropdown"
                  >
                    {auth.user.roles?.includes('admin-1') && (
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
                    <NavDropdown.Item onClick={handleLogout}>
                      Cerrar sesión
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                )}
              </div>
              <Link to="/cart" className="cart-link">
                <span className="material-symbols-outlined icon-dark">garden_cart</span>
                {cartItemCount > 0 && (
                  <span className="cart-count">
                    {cartItemCount}
                  </span>
                )}
                <span>Carro de compra</span>
              </Link>
            </div>
          </Navbar>
        </Col>
      </Row>
      <Row className="nav-row">
        <Col md={12}>
          <Navbar expand="lg" className="bottom-navbar">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="main-nav">
                <Nav.Link as={Link} to="/">
                  <span className="nav-text">Inicio</span>
                </Nav.Link>
                <NavDropdown
                  title={<span className="nav-text">Plantas</span>}
                  id="plantas-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/catalogo">
                    Catálogo
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/categorias">
                    Categorías
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={<span className="nav-text">Comunidad</span>}
                  id="comunidad-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/foros">
                    Foros
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/eventos">
                    Eventos
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={<span className="nav-text">Educación</span>}
                  id="educacion-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/style-guide">
                    Guía de Estilo
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/recursos">
                    Recursos
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={<span className="nav-text">Asistente Virtual</span>}
                  id="asistente-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/faq">
                    FAQ
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/contacto">
                    Contacto
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomNav;