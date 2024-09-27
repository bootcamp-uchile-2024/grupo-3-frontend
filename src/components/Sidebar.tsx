import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: '280px' }}>
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <svg className="bi pe-none me-2" width="40" height="32">
          <use xlinkHref="#bootstrap" />
        </svg>
        <span className="fs-4">Sidebar</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link to="/crearProducto" className={`nav-link ${location.pathname === '/crearProducto' ? 'active' : ''}`}>
            <i className="bi bi-grid me-2"></i>
            Crear Producto
          </Link>
        </li>
        <li>
          <Link to="/customers" className="nav-link text-white">
            <i className="bi bi-person-circle me-2"></i>
            Crear Usuario
          </Link>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <Link
          to="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>mdo</strong>
        </Link>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
          <li><Link className="dropdown-item" to="#">New project...</Link></li>
          <li><Link className="dropdown-item" to="#">Settings</Link></li>
          <li><Link className="dropdown-item" to="#">Profile</Link></li>
          <li><hr className="dropdown-divider" /></li>
          <li><Link className="dropdown-item" to="#">Sign out</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
