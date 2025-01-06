import React from 'react';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import { RootState } from '../states/store';

interface CartItem {
  id: number; 
  nombre: string;
  cantidad: number;
  precio: number;
}

interface HeaderProps {
  user: { username: string; role: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const cartItems = useSelector((state: RootState) => state.cart.productos) || []; 

  const getTotalItems = (items: CartItem[] = []) => {
    return items.reduce((total, item) => total + item.cantidad, 0); 
  };

  const cartItemCount = user?.role === "admin" ? 0 : getTotalItems(cartItems);

  return (
    <header>
      <Nav user={user} onLogout={onLogout} cartItemCount={cartItemCount} />
    </header>
  );
};

export default Header;

