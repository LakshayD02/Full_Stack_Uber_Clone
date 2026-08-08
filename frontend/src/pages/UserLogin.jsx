import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        email,
        password
      })

      if (response.status === 200) {
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('role', 'user')
        navigate('/home')
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
        <div className='w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl'>
          <div className='text-center mb-8'>
            <span className='h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 inline-flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30'>
              <i className="ri-user-3-fill text-2xl text-white"></i>
            </span>
            <h2 className='text-3xl font-black tracking-tight'>Rider Sign In</h2>
            <p className='text-gray-400 text-sm mt-1'>Welcome back! Log in to request rides.</p>
          </div>

          <form onSubmit={submitHandler} className='space-y-5'>
            <div>
              <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>Email Address</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 w-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                type='email'
                placeholder='name@example.com'
              />
            </div>

            <div>
              <div className='flex justify-between items-center mb-2'>
                <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider'>Password</label>
                <Link to='/forgot-password?role=user' className='text-xs text-blue-400 hover:underline font-medium'>Forgot Password?</Link>
              </div>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 w-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                type='password'
                placeholder='••••••••'
              />
            </div>

            {error && <p className='text-red-400 text-xs text-center font-medium'>{error}</p>}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-white text-black font-bold py-4 rounded-2xl text-base hover:bg-gray-100 transition-all duration-300 transform active:scale-98 shadow-xl'
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className='mt-6 text-center space-y-3 text-sm'>
            <p className='text-gray-400'>
              New to Uber?{' '}
              <Link to='/signup' className='text-white font-semibold hover:underline'>Create account</Link>
            </p>
            <div className='border-t border-white/10 pt-4'>
              <Link
                to='/captain-login'
                className='inline-flex items-center gap-2 text-yellow-400 text-xs font-semibold hover:text-yellow-300 transition-colors'
              >
                <i className="ri-steering-2-fill"></i> Captain Sign In instead →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default UserLogin