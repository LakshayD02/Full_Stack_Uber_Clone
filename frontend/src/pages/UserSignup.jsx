import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, {
        fullname: { firstname: firstName, lastname: lastName },
        email,
        password
      })

      if (response.status === 201) {
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('role', 'user')
        navigate('/home')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col justify-between bg-black text-white font-sans'>
      <Navbar />

      <main className='flex-1 flex items-center justify-center p-6 my-8'>
        <div className='w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl'>
          <div className='text-center mb-6'>
            <h2 className='text-3xl font-black tracking-tight'>Create Rider Account</h2>
            <p className='text-gray-400 text-sm mt-1'>Sign up to start riding across the city.</p>
          </div>

          <form onSubmit={submitHandler} className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs font-semibold text-gray-400 uppercase mb-1'>First Name</label>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm'
                  type='text'
                  placeholder='John'
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-400 uppercase mb-1'>Last Name</label>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm'
                  type='text'
                  placeholder='Doe'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-400 uppercase mb-1'>Email Address</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm'
                type='email'
                placeholder='name@example.com'
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-400 uppercase mb-1'>Password</label>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm'
                type='password'
                placeholder='At least 6 characters'
              />
            </div>

            {error && <p className='text-red-400 text-xs text-center font-medium'>{error}</p>}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-white text-black font-bold py-4 rounded-2xl text-base hover:bg-gray-100 transition-all duration-300 transform active:scale-98 shadow-xl mt-2'
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className='text-center text-gray-400 text-sm mt-6'>
            Already have an account?{' '}
            <Link to='/login' className='text-white font-semibold hover:underline'>Sign In</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default UserSignup