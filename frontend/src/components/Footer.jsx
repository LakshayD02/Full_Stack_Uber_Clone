import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-black border-t border-white/10 py-10 px-6 text-gray-400 text-sm mt-auto w-full'>
      <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6'>
        <div className='flex items-center gap-3'>
          <img
            className='h-6'
            src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
            alt='Uber'
            style={{ filter: 'invert(1)' }}
          />
          <span className='text-xs text-gray-500'>© 2025 Uber Technologies Inc.</span>
        </div>

        <div className='flex flex-wrap items-center gap-6 text-xs text-gray-400'>
          <Link to='/' className='hover:text-white transition-colors'>Home</Link>
          <Link to='/signup' className='hover:text-white transition-colors'>Rider Signup</Link>
          <Link to='/captain-signup' className='hover:text-white transition-colors'>Captain Signup</Link>
          <a href='#' className='hover:text-white transition-colors'>Privacy Policy</a>
          <a href='#' className='hover:text-white transition-colors'>Terms of Service</a>
        </div>

        <div className='flex items-center gap-3'>
          {['ri-twitter-fill', 'ri-instagram-fill', 'ri-github-fill'].map((icon, i) => (
            <a key={i} href='#' className='h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors'>
              <i className={`${icon} text-xs`}></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
