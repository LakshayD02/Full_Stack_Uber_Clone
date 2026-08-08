import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Captainlogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, {
        email,
        password
      })

      if (response.status === 200) {
        setCaptain(response.data.captain)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('role', 'captain')
        navigate('/captain-home')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Invalid email or password. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col justify-between bg-black text-white font-sans'>
      <Navbar />

      <main className='flex-1 flex items-center justify-center p-6 my-8'>
        <div className='w-full max-w-md bg-white/5 backdrop-blur-xl border border-yellow-500/20 p-8 rounded-3xl shadow-2xl'>
          <div className='text-center mb-8'>
            <span className='h-12 w-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 inline-flex items-center justify-center mb-3 shadow-lg shadow-yellow-500/20'>
              <i className="ri-steering-2-fill text-2xl text-black"></i>
            </span>
            <h2 className='text-3xl font-black tracking-tight'>Captain Sign In</h2>
            <p className='text-gray-400 text-sm mt-1'>Log in to accept rides & earn.</p>
          </div>

          <form onSubmit={submitHandler} className='space-y-5'>
            <div>
              <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>Email Address</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors'
                type='email'
                placeholder='captain@example.com'
              />
            </div>

            <div>
              <div className='flex justify-between items-center mb-2'>
                <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider'>Password</label>
                <Link to='/forgot-password?role=captain' className='text-xs text-yellow-400 hover:underline font-medium'>Forgot Password?</Link>
              </div>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors'
                type='password'
                placeholder='••••••••'
              />
            </div>

            {error && <p className='text-red-400 text-xs text-center font-medium'>{error}</p>}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-yellow-400 text-black font-bold py-4 rounded-2xl text-base hover:bg-yellow-300 transition-all duration-300 transform active:scale-98 shadow-xl shadow-yellow-500/20'
            >
              {isLoading ? 'Signing in...' : 'Sign In as Captain'}
            </button>
          </form>

          <div className='mt-6 text-center space-y-3 text-sm'>
            <p className='text-gray-400'>
              Want to drive with Uber?{' '}
              <Link to='/captain-signup' className='text-yellow-400 font-semibold hover:underline'>Register as Captain</Link>
            </p>
            <div className='border-t border-white/10 pt-4'>
              <Link
                to='/login'
                className='inline-flex items-center gap-2 text-blue-400 text-xs font-semibold hover:text-blue-300 transition-colors'
              >
                <i className="ri-user-3-fill"></i> Rider Sign In instead →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Captainlogin