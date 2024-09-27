import Header from '../components/Header';
import '../index.css';
import { Outlet, Link } from 'react-router-dom';
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
        {user && user.role === 'admin' && (
          <nav>
            <ul>
              <li>
                <Link to="/create-product">Crear Producto</Link>
              </li>
            </ul>
          </nav>
        )}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}



