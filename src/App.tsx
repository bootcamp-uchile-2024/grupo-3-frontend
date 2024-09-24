import './App.css'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginForm from './pages/LoginForm';
import UserCreationForm from './pages/UserCreateForm';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout /> } >
            <Route index element={<HomePage/>} />
            <Route path="catalogo" element={<CatalogPage/>} />
            <Route path="catalogo/producto/:id" element={<ProductDetailPage/>} />
            <Route path="about" element={<AboutPage/>} />
            <Route path="contact" element={<ContactPage/>} />
            <Route path="login" element={<LoginForm />} /> 
            <Route path="create-user" element={<UserCreationForm />} /> 
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App