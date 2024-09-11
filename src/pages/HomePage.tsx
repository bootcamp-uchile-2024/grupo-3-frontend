import React from 'react';
import '../index.css'
import Banner from '../components/Banner'
import PlantCareTips from '../components/PlantCareTips';
import Products from '../components/Products';

export default function HomePage() {
  return (
    <div>
       <Banner />
      <Products />
      <PlantCareTips />
    </div>
  );
}
