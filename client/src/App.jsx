import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Movies from './pages/Movies'
import MyBooking from './pages/MyBooking'
import SeatLayout from './pages/SeatLayout'
import Favourite from './pages/Favourite'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  return (
    <>
    <Toaster />
    {!isAdminRoute && <Navbar />}
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/movies' element={<Movies />}/>
      <Route path='/movies/:id' element={<MovieDetail />}/>
      <Route path='/movies/:id/:date' element={<SeatLayout />}/>
      <Route path='/my-bookings' element={<MyBooking />}/>
      <Route path='/favourite' element={<Favourite />}/>
    </Routes>
    {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
