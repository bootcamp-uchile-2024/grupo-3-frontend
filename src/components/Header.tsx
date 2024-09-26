import { Link } from 'react-router-dom';
import React from 'react';
import Nav from './Nav';

interface HeaderProps {
  user: { username: string; role: string } | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header>
      <div id="logo">
        <Link to="/">
          <div className="circle"></div>
          <h1>Plantai</h1>
        </Link>
      </div>
      <Nav id="navbar-top" />
      <div id="search-form">
        <input
          className='search-form-input'
          type="text"
          placeholder="Buscar"
        />
        <i className="fas fa-search"></i>
      </div>

      <div id="login"> 
        <ul>
          <li>
            {user ? `Hola, ${user.role === 'admin' ? 'Admin' : 'User'}` : <Link to="/login">Login</Link>}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
