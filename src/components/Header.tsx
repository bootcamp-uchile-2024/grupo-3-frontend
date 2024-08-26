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
                <li><a href="#">Home</a></li>
                <li><a href="#">Plantas</a></li>
                <li><a href="#">Tienda</a></li>
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
  )
}

export default Header;