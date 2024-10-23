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
    <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <h1 className="mb-0">Plantai</h1>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">Acerca</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contacto</Link>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
          <div className="d-flex ms-auto align-items-center">
            <form className="d-flex me-2" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-dark" type="submit">Buscar</button>
            </form>
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
                      <li><Link className="dropdown-item" to="/crear-usuario">Crear Usuario</Link></li>
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
                        localStorage.removeItem('user')
                      }}>
                      Cerrar sesión
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="btn btn-link" to="/login">Login</Link>
            )}
            { }
            <Link to="/cart" className="btn btn-link me-3 position-relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-garden-cart" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
                <path d="M6 8v11a1 1 0 0 0 1.806 .591l3.694 -5.091v.055" />
                <path d="M6 8h15l-3.5 7l-7.1 -.747a4 4 0 0 1 -3.296 -2.493l-2.853 -7.13a1 1 0 0 0 -.928 -.63h-1.323" />
              </svg>
              {cartItemCount > 0 && (
                <span className="cart-count position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
