import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isDropdownActive = (paths: string[]) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  return (
    <Navbar collapseOnSelect className="custom-navbar fixed-top" expand="lg">
      <Container className="nav-container">
        <Navbar.Brand as={Link} to="/" />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          {/* Navegación principal */}
          <Nav className="main-nav mx-auto">
            {/* Inicio */}
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Inicio
            </Nav.Link>

            {/* Dropdown Plantas */}
            <NavDropdown
              title="Plantas"
              id="plantas-dropdown"
              className={`nav-dropdown ${isDropdownActive(['/catalogo', '/categorias']) ? 'active' : ''}`}
            >
              <NavDropdown.Item
                as={Link}
                to="/catalogo"
                className={isActive('/catalogo') ? 'active' : ''}
              >
                Catálogo
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/categorias"
                className={isActive('/categorias') ? 'active' : ''}
              >
                Categorías
              </NavDropdown.Item>
            </NavDropdown>

            {/* Dropdown Comunidad */}
            <NavDropdown
              title="Comunidad"
              id="comunidad-dropdown"
              className={`nav-dropdown ${isDropdownActive(['/foros', '/eventos']) ? 'active' : ''}`}
            >
              <NavDropdown.Item
                as={Link}
                to="/foros"
                className={isActive('/foros') ? 'active' : ''}
              >
                Foros
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/eventos"
                className={isActive('/eventos') ? 'active' : ''}
              >
                Eventos
              </NavDropdown.Item>
            </NavDropdown>

            {/* Dropdown Educación */}
            <NavDropdown
              title="Educación"
              id="educacion-dropdown"
              className={`nav-dropdown ${isDropdownActive(['/recursos']) ? 'active' : ''}`}
            >
              <NavDropdown.Item
                as={Link}
                to="/recursos"
                className={isActive('/recursos') ? 'active' : ''}
              >
                Recursos
              </NavDropdown.Item>
            </NavDropdown>

            {/* Dropdown Asistente Virtual */}
            <NavDropdown
              title="Asistente Virtual"
              id="asistente-dropdown"
              className={`nav-dropdown ${isDropdownActive(['/faq', '/contacto']) ? 'active' : ''}`}
            >
              <NavDropdown.Item
                as={Link}
                to="/faq"
                className={isActive('/faq') ? 'active' : ''}
              >
                FAQ
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/contacto"
                className={isActive('/contacto') ? 'active' : ''}
              >
                Contacto
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Sección de acciones de usuario */}
          <div className="nav-actions">
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
            </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNav;