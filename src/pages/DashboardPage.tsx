import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CrearProducto from '../pages/CreateProductForm'; // Ajusta la ruta según sea necesario
import Sidebar from '../components/Sidebar';

const DashboardPage: React.FC = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="crearProducto" element={<CrearProducto />} />
          {/* Otras rutas del dashboard pueden ir aquí */}
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;
