import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductDetailPage from './pages/ProductDetailPage';


function App() {

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