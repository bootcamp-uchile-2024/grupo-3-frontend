import './styles/App.css';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginForm from './pages/LoginForm';
import UserCreationForm from './pages/UserCreateForm';
/* import DashboardPage from './pages/DashboardPage'; */
import CrearProducto from './pages/CreateProductForm';
import { useState } from 'react';
import { PrivateRoute } from './protected/PrivateRoute';
import CartPage from './pages/CartPage';

function App() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  const handleLogin = (username: string, role: string) => {
    setUser({ username, role });
  };

  const handleLogout = () => {
    setUser(null); 
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<HomePage />} />
            <Route path="catalogo" element={<CatalogPage />} />
            <Route path="catalogo/producto/:id" element={<ProductDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginForm onLogin={handleLogin} />} />
            {/* <Route path="dashboard" element={<DashboardPage />} /> */}
            <Route path="crear-usuario" element={<UserCreationForm />} />
            <Route path="crear-usuario" element={<PrivateRoute roles={["admin-1"]}><CrearProducto /></PrivateRoute>} />
            <Route path="cart" element={<CartPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;



