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

  const isActive = (path: string) => location.pathname === path;

  const isDropdownActive = (paths: string[]) =>
    paths.some((path) => location.pathname.startsWith(path));

  return (
    
    <Navbar collapseOnSelect className="custom-navbar fixed-top" expand="lg">
      <Container className="nav-container">
        <Navbar.Brand as={Link} to="/" />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          {/* Navegación principal */}
          <Nav className="main-nav mx-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Inicio
            </Nav.Link>
            <NavDropdown
              title="Plantas"
              id="plantas-dropdown"
              className={`nav-dropdown ${
                isDropdownActive(["/catalogo", "/categorias"]) ? "active" : ""
              }`}
            >
              <NavDropdown.Item
                as={Link}
                to="/catalogo"
                className={isActive("/catalogo") ? "active" : ""}
              >
                Catálogo
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/categorias"
                className={isActive("/categorias") ? "active" : ""}
              >
                Categorías
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="Comunidad"
              id="comunidad-dropdown"
              className={`nav-dropdown ${
                isDropdownActive(["/foros", "/eventos"]) ? "active" : ""
              }`}
            >
              <NavDropdown.Item
                as={Link}
                to="/foros"
                className={isActive("/foros") ? "active" : ""}
              >
                Foros
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/eventos"
                className={isActive("/eventos") ? "active" : ""}
              >
                Eventos
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="Educación"
              id="educacion-dropdown"
              className={`nav-dropdown ${
                isDropdownActive(["/recursos"]) ? "active" : ""
              }`}
            >
              <NavDropdown.Item
                as={Link}
                to="/recursos"
                className={isActive("/recursos") ? "active" : ""}
              >
                Recursos
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                <NavDropdown
                  title={
                    user.role === "Super Admin" ? (
                      <img
                        src="https://ui-avatars.com/api/?name=Admin&background=1A4756&color=fff&size=128"
                        alt="Avatar"
                        className="user-avatar"
                      />
                    ) : (
                      <img
                        src="https://ui-avatars.com/api/?name=Cl&background=1A4756&color=fff&size=128"
                        alt="Avatar"
                        className="user-avatar"
                      />
                    )
                  }
                  id="user-dropdown"
                  className="nav-dropdown no-caret"
                >
                  {user.role === "Super Admin" && (
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
                      onLogout(); 
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setTimeout(() => navigate("/"), 100);
                    }}
                  >
                    Cerrar sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <Nav.Link as={Link} to="/login" className="login-link">
                Registrarse/Login
              </Nav.Link>
            )}

            {user?.role !== "Super Admin" && (
              <Nav.Link as={Link} to="/cart" className="cart-link">
                <span className="material-symbols-outlined">shopping_cart</span>
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Nav.Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNav;





