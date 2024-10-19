import React from 'react';
import Nav from './Nav';
import { useSelector } from 'react-redux'; 
import { RootState } from '../states/store'; 
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: { username: string; role: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items); // Obtener los productos del carrito

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0); // Calcular el total de productos
  };

  return (
    <header>
      <Nav user={user} onLogout={onLogout} />
      <div className="cart-button-container">
        <Link to="/cart" className="cart-button">
          {/* Aquí está el ícono de carretilla */}
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-garden-cart" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
            <path d="M6 8v11a1 1 0 0 0 1.806 .591l3.694 -5.091v.055" />
            <path d="M6 8h15l-3.5 7l-7.1 -.747a4 4 0 0 1 -3.296 -2.493l-2.853 -7.13a1 1 0 0 0 -.928 -.63h-1.323" />
          </svg> 
          {getTotalItems() > 0 && (
            <span className="cart-count">{getTotalItems()}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;


