import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ForgotPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const role = searchParams.get('role') === 'captain' ? 'captain' : 'user'

  const [step, setStep] = useState(1) // Step 1: Send Email, Step 2: Verify OTP & Set Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    const endpoint = role === 'captain'
      ? `${import.meta.env.VITE_BASE_URL}/captains/forgot-password`
      : `${import.meta.env.VITE_BASE_URL}/users/forgot-password`

    try {
      const response = await axios.post(endpoint, { email })
      if (response.status === 200) {
        setMessage(response.data.message || 'OTP sent to your email!')
        setStep(2)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    const endpoint = role === 'captain'
      ? `${import.meta.env.VITE_BASE_URL}/captains/reset-password`
      : `${import.meta.env.VITE_BASE_URL}/users/reset-password`

    try {
      const response = await axios.post(endpoint, {
        email,
        otp,
        newPassword,
      })

      if (response.status === 200) {
        setMessage('Password reset successful! Redirecting to login...')
        setTimeout(() => {
          navigate(role === 'captain' ? '/captain-login' : '/login')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or reset failed.')
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
            <span className={`h-12 w-12 rounded-2xl inline-flex items-center justify-center mb-3 shadow-lg ${role === 'captain' ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white'}`}>
              <i className={`${role === 'captain' ? 'ri-steering-2-fill' : 'ri-lock-password-fill'} text-2xl`}></i>
            </span>
            <h2 className='text-3xl font-black tracking-tight'>Reset Password</h2>
            <p className='text-gray-400 text-sm mt-1'>
              {role === 'captain' ? 'Captain Portal' : 'Rider Portal'} · {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
            </p>
          </div>

          {step === 1 ? (
            /* STEP 1: Enter Email */
            <form onSubmit={handleSendOtp} className='space-y-5'>
              <div>
                <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>Registered Email Address</label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors'
                  type='email'
                  placeholder='name@example.com'
                />
              </div>

              {error && <p className='text-red-400 text-xs text-center font-medium'>{error}</p>}
              {message && <p className='text-green-400 text-xs text-center font-medium'>{message}</p>}

              <button
                type='submit'
                disabled={isLoading}
                className={`w-full font-bold py-4 rounded-2xl text-base transition-all duration-300 transform active:scale-98 shadow-xl ${role === 'captain' ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-white text-black hover:bg-gray-100'}`}
              >
                {isLoading ? 'Sending OTP...' : 'Send Reset OTP'}
              </button>
            </form>
          ) : (
            /* STEP 2: Enter OTP & New Password */
            <form onSubmit={handleResetPassword} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>6-Digit OTP Code</label>
                <input
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 w-full text-white text-center font-mono text-xl tracking-[0.4em] focus:outline-none focus:border-yellow-400 transition-colors'
                  type='text'
                  maxLength={6}
                  placeholder='123456'
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>New Password</label>
                <input
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors'
                  type='password'
                  placeholder='At least 6 characters'
                />
              </div>

              {error && <p className='text-red-400 text-xs text-center font-medium'>{error}</p>}
              {message && <p className='text-green-400 text-xs text-center font-medium'>{message}</p>}

              <button
                type='submit'
                disabled={isLoading}
                className={`w-full font-bold py-4 rounded-2xl text-base transition-all duration-300 transform active:scale-98 shadow-xl ${role === 'captain' ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-white text-black hover:bg-gray-100'}`}
              >
                {isLoading ? 'Resetting Password...' : 'Confirm & Reset Password'}
              </button>

              <button
                type='button'
                onClick={() => setStep(1)}
                className='w-full text-xs text-gray-400 hover:text-white transition-colors text-center py-2'
              >
                ← Back to Enter Email
              </button>
            </form>
          )}

          <div className='mt-6 text-center border-t border-white/10 pt-4'>
            <Link
              to={role === 'captain' ? '/captain-login' : '/login'}
              className='text-xs text-gray-400 hover:text-white transition-colors'
            >
              Remembered your password? <span className='underline font-semibold'>Sign In</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ForgotPassword
