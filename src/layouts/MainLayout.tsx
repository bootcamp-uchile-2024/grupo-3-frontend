import React from 'react'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Reviews from '../components/Reviews'
import PlantCareTips from '../components/PlantCareTips';




export default function MainLayout() {
  return (
    <>
        <Header />
        <Nav />
        <Reviews />
        <PlantCareTips />
    </>
  )
}
