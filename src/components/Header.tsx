import { Link } from 'react-router-dom'
import React from 'react';
import Nav from './Nav';

const Header: React.FC = () => {
  return (
    <header>
        <div id="logo">
        <Link to="/">
          <div className="circle"></div>
          <h1>Cotiledón</h1>
        </Link>
        </div>
        <Nav id="navbar-top" />
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
