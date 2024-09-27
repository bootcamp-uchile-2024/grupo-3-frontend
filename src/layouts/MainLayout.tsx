import Header from '../components/Header';
import '../index.css';
import { Outlet, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface MainLayoutProps {
  user: { username: string; role: string } | null;
  onLogout: () => void; // Añadimos onLogout como una prop obligatoria
}

export default function MainLayout({ user, onLogout }: MainLayoutProps) {
  return (
    <>
      <Header user={user} onLogout={onLogout} /> {/* Pasamos onLogout al Header */}
      <main>
        {/* Si el usuario es administrador, muestra el enlace a 'Crear Producto' */}
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



