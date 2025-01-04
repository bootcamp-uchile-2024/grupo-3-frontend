import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
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
    <Navbar collapseOnSelect className="custom-navbar fixed-top" expand="lg">
      <Container className="nav-container">
        <Navbar.Brand as={Link} to="/" />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="main-nav mx-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              Inicio
            </Nav.Link>
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
  
          <Nav className="nav-actions">
            {user ? (
              <div className="user-menu">
                <img
                  src="https://ui-avatars.com/api/?name=Admin&background=1A4756&color=fff&size=128"
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNav;