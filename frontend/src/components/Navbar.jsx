import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ mode = 'user' }) => {
  const location = useLocation()

  return (
    <header className='w-full z-50 px-6 py-4 flex items-center justify-between bg-black/90 backdrop-blur-md border-b border-white/10'>
      <Link to='/' className='flex items-center gap-2'>
        <span className='text-xl font-black tracking-tight text-white'>Ride<span className='text-blue-400'>X</span></span>
      </Link>

      <nav className='hidden md:flex items-center gap-6 text-sm text-gray-300'>
        <Link to='/' className='hover:text-white transition-colors'>Home</Link>
        <Link to='/signup' className='hover:text-white transition-colors'>Ride</Link>
        <Link to='/captain-signup' className='hover:text-white transition-colors'>Drive</Link>
      </nav>

      <div className='flex items-center gap-3'>
        <Link
          to={location.pathname.includes('captain') ? '/login' : '/captain-login'}
          className='text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors border border-white/20 px-3 py-1.5 rounded-full bg-white/5'
        >
          {location.pathname.includes('captain') ? 'Switch to Rider' : 'Switch to Captain'}
        </Link>
        {location.pathname !== '/login' && location.pathname !== '/captain-login' && (
          <Link
            to={location.pathname.includes('captain') ? '/captain-login' : '/login'}
            className='text-xs sm:text-sm font-medium hover:text-gray-300 transition-colors'
          >
            Log in
          </Link>
        )}
        {location.pathname !== '/signup' && location.pathname !== '/captain-signup' && (
          <Link
            to={location.pathname.includes('captain') ? '/captain-signup' : '/signup'}
            className='bg-white text-black font-bold text-xs sm:text-sm px-4 py-2 rounded-full hover:bg-gray-100 transition-all hover:scale-105'
          >
            Sign up
          </Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
