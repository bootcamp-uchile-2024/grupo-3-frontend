import Header from '../components/Header';
import '../index.css';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface MainLayoutProps {
  user: { username: string; role: string } | null;
  onLogout: () => void; 
}

export default function MainLayout({ user, onLogout }: MainLayoutProps) {
  return (
    <>
      <Header user={user} onLogout={onLogout} /> 
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}



