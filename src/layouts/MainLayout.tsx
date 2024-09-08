import React from 'react'
import Header from '../components/Header'
import Banner from '../components/Banner'
import '../index.css'
import { Outlet } from 'react-router-dom'
import PlantCareTips from '../components/PlantCareTips'
import Footer from '../components/Footer'

export default function MainLayout() {
  return (
    <>
      <Header />
      
      <Banner />
      <main>
            <Outlet />
      </main>
      <PlantCareTips />
      <Footer />
    </>
  )
}
