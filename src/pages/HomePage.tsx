import React from 'react';
import '../index.css'
import Banner from '../components/Banner'
import PlantCareTips from '../components/PlantCareTips';
import Products from '../components/Products';

export default function HomePage() {
  return (
    <div>
       <Banner />
      <h2>Bienvenido a la Página de Inicio</h2>
      {/* Otros elementos específicos de la página de inicio */}
      <Products />
      <PlantCareTips />
    </div>
  );
}
