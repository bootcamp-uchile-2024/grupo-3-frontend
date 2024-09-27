import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface HeaderProps {
  user: { username: string; role: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <div className="circle me-2"></div>
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
                <Link className="nav-link" to="/about">Equipo</Link>
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
            <div className="d-flex ms-auto">
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
                user.role === 'admin' ? (
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
                      <li><Link className="dropdown-item" to="/opcion1">Crear Producto</Link></li>
                      <li><Link className="dropdown-item" to="/opcion2">Opción 2</Link></li>
                      <li><Link className="dropdown-item" to="/opcion3">Opción 3</Link></li>
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/" 
                          onClick={() => {
                            onLogout(); 
                            navigate('/login');
                          }}>
                          Cerrar sesión
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <span className="navbar-text">Hola, {user.username}</span>
                )
              ) : (
                <Link className="btn btn-link" to="/login">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
