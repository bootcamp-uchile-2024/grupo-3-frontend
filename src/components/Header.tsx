import React from 'react';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import { RootState } from '../states/store';

interface HeaderProps {
  user: { username: string; role: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items); // Obtener los productos del carrito

const getTotalItems = () => {
  return cartItems.reduce((total, item) => total + item.cantidad, 0); // Calcular el total de productos
  };

const cartItemCount = getTotalItems();

return (
  <header>
    <Nav user={user} onLogout={onLogout} cartItemCount={cartItemCount} /> { }
  </header>
  );
};

export default Header;
