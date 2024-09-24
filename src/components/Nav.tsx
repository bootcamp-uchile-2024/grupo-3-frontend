import React from 'react'
import { Link } from 'react-router-dom'

interface NavProps {
  id?: string; // Prop opcional para el ID
  }

  const Nav: React.FC<NavProps> = ({ id }) => {
    return (
      <nav id={id}>
        <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/about">Quienes somos</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
        </ul>
    </nav>
  )
}

export default Nav;
