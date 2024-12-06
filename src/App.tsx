import './styles/index.css';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginForm from './pages/LoginForm';
import UserCreationForm from './pages/UserCreateForm';
import CrearProducto from './pages/CreateProductForm';
import { PrivateRoute } from './protected/PrivateRoute';
import CartPage from './pages/CartPage';
import UserManagement from './pages/UserManagement';
import EditProductPage from './pages/EditProductPage';
import AdminCartPage from './pages/AdminCartPage';
import StyleGuide from './components/StyleGuide';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './context/AuthContext';import ProductManagement from './pages/ProductManagement';


function AppContent() {
  const { auth, setAuth } = useAuth();

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      user: null
    });
    localStorage.removeItem('user');
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<HomePage />} />
            <Route path="style-guide" element={<StyleGuide />} />
            <Route path="catalogo" element={<CatalogPage />} />
            <Route path="catalogo/producto/:id" element={<ProductDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginForm onLogin={handleLogin} />} />
            {/* <Route path="dashboard" element={<DashboardPage />} /> */}
            <Route path="crear-usuario" element={<UserCreationForm isAdmin={false}/>} />
            <Route path="crear-producto" element={<PrivateRoute roles={["admin-1"]}><CrearProducto /></PrivateRoute>} />
            <Route path="editar-producto/:id" element={<PrivateRoute roles={["admin-1"]}><EditProductPage /></PrivateRoute>} />
            <Route path="cart" element={<CartPage />} />
            <Route path="user-management" element={<PrivateRoute roles={['admin-1']}><UserManagement /></PrivateRoute>} />

            {/* Nueva ruta para AdminCartPage */}
            <Route path="admin-carts" element={<PrivateRoute roles={['admin-1']}><AdminCartPage /></PrivateRoute>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;