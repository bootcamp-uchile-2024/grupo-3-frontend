import React from 'react'
import Header from '../components/Header'
import Banner from '../components/Banner'
import Products from '../components/Products'
import Reviews from '../components/Reviews'
/* import PlantCareTips from '../components/PlantCareTips' */
import Footer from '../components/Footer'


export default function MainLayout() {
  return (
    <>
        <Header />
        <Banner />
        <Products />
        <Reviews />
        {/* <PlantCareTips /> */}
        <Footer />
    </>
  )
}
