import React from 'react'
import Header from '../components/Header'
import '../index.css'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

export default function MainLayout() {
  return (
    <>
      <Header />
      <main>
            <Outlet />
      </main>
      <Footer />
    </>
  )
}
