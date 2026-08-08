import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CaptainSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, {
        fullname: { firstname: firstName, lastname: lastName },
        email,
        password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: Number(vehicleCapacity),
          vehicleType
        }
      })

      if (response.status === 201) {
        setCaptain(response.data.captain)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('role', 'captain')
        navigate('/captain-home')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Captain registration failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col justify-between bg-black text-white font-sans'>
      <Navbar />

      <main className='flex-1 flex items-center justify-center p-6 my-8'>
        <div className='w-full max-w-lg bg-white/5 backdrop-blur-xl border border-yellow-500/20 p-8 rounded-3xl shadow-2xl'>
          <div className='text-center mb-6'>
            <h2 className='text-3xl font-black tracking-tight'>Register as Captain</h2>
            <p className='text-gray-400 text-sm mt-1'>Drive & earn on your own terms.</p>
          </div>

          <form onSubmit={submitHandler} className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs font-semibold text-gray-400 uppercase mb-1'>First Name</label>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm'
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
                  className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm'
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
                className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm'
                type='email'
                placeholder='captain@example.com'
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-400 uppercase mb-1'>Password</label>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm'
                type='password'
                placeholder='At least 6 characters'
              />
            </div>

            {/* Vehicle info */}
            <div className='border-t border-white/10 pt-4 mt-2'>
              <p className='text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3'>Vehicle Details</p>
              
              <div className='grid grid-cols-2 gap-3 mb-3'>
                <div>
                  <input
                    required
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm'
                    type='text'
                    placeholder='Vehicle Color'
                  />
                </div>
                <div>
                  <input
                    required
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm'
                    type='text'
                    placeholder='Plate Number (DL01AB1234)'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <input
                    required
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    className='bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm'
                    type='number'
                    min='1'
                    placeholder='Seat Capacity'
                  />
                </div>
                <div>
                  <select
                    required
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className='bg-gray-900 border border-white/10 rounded-2xl px-4 py-3 w-full text-white focus:outline-none focus:border-yellow-400 text-sm'
                  >
                    <option value='' disabled>Select Type</option>
                    <option value='car'>Car (UberGo)</option>
                    <option value='motorcycle'>Moto</option>
                    <option value='auto'>UberAuto</option>
                  </select>
                </div>
              </div>
            </div>

            {error && <p className='text-red-400 text-xs text-center font-medium'>{error}</p>}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-yellow-400 text-black font-bold py-4 rounded-2xl text-base hover:bg-yellow-300 transition-all duration-300 transform active:scale-98 shadow-xl shadow-yellow-500/20 mt-2'
            >
              {isLoading ? 'Registering...' : 'Register as Captain'}
            </button>
          </form>

          <p className='text-center text-gray-400 text-sm mt-6'>
            Already registered as captain?{' '}
            <Link to='/captain-login' className='text-yellow-400 font-semibold hover:underline'>Captain Sign In</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CaptainSignup