import React from 'react';
import Nav from './Nav';

interface HeaderProps {
  user: { username: string; role: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header>
      <Nav user={user} onLogout={onLogout} />
    </header>
  );
};

export default Header;


