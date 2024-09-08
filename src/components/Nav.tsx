import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav>
        <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li><Link to="/catalog">Catalogo</Link></li>
            <li><Link to="/about">Quienes somos</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
        </ul>
    </nav>
  )
}
