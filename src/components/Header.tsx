import { Link } from 'react-router-dom'
import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
        <div id="logo">
            <a href="index.html">
                <div className="circle"></div>
                <h1>Cotiledón</h1>
            </a>
        </div>
 
        <nav id="navbar-top">
        <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li><Link to="/catalog">Catalogo</Link></li>
            <li><Link to="/about">Quienes somos</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
        </ul>
        </nav>

        <div id="search-form">
            <input
              type="text" 
              placeholder="Buscar"
            />
            <i className="fas fa-search"></i>
        </div>

        <div id="login">
            <ul>
                <li><a href="#">Login</a></li>
            </ul>
        </div>
    </header>
  );
}

export default Header;