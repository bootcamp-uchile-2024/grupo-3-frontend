import { useState } from 'react'
import './App.css'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductDetailPage from './pages/ProductDetailPage';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout /> } >
            <Route index element={<HomePage/>} />
            <Route path="catalog" element={<CatalogPage/>} />
            <Route path="catalog/product/:id" element={<ProductDetailPage/>} />
            <Route path="about" element={<AboutPage/>} />
            <Route path="contact" element={<ContactPage/>} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App