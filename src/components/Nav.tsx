import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavProps {
  id?: string;
  user: { username: string; role: string } | null;
  onLogout: () => void;
  cartItemCount: number;
}

const Nav: React.FC<NavProps> = ({ user, onLogout, cartItemCount }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg w-100">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/style-guide">Guía de estilos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">Plantas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Comunidad</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Educación</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Asistente Virtual</Link>
            </li>
          </ul>
          <div className="d-flex ms-auto align-items-center">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-link dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Hola, {user.username}
                </button>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  {user.role === 'admin' && (
                    <>
                      <li><Link className="dropdown-item" to="/crear-producto">Crear Producto</Link></li>
                      <li><Link className="dropdown-item" to="/user-management">Gestión de Usuarios</Link></li>
                      <li><Link className="dropdown-item" to="/admin-carts">Gestión de Carritos</Link></li> {/* NUEVO */}
                    </>
                  )}
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/"
                      onClick={() => {
                        alert('Has cerrado sesión.');
                        onLogout();
                        navigate('/login');
                        localStorage.removeItem('user');
                      }}>
                      Cerrar sesión
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="btn btn-link" to="/login">Login</Link>
            )}
            <Link to="/cart" className="btn btn-link me-3 position-relative">
            <span className="material-symbols-outlined icon-white">garden_cart</span>
              {cartItemCount > 0 && (
                <span className="cart-count position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                </span>
              )}
              Carro de compra
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;

