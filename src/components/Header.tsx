import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface HeaderProps {
  user: { username: string; role: string } | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
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
              <span className="navbar-text">Hola, {user.username}</span>
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
