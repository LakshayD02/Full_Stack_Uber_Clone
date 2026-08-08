import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { CaptainDataContext } from '../context/CapatainContext'

const Profile = () => {
  const { user, setUser } = useContext(UserDataContext)
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()
  const location = useLocation()

  // Detect if we are on the captain profile path
  const isCaptainRoute = location.pathname === '/captain-profile'
  const isCaptain = isCaptainRoute && Boolean(captain?._id)
  const currentUser = isCaptain ? captain : user

  const [firstName, setFirstName] = useState(currentUser?.fullname?.firstname || '')
  const [lastName, setLastName] = useState(currentUser?.fullname?.lastname || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    if (isCaptain) {
      setCaptain(prev => ({ ...prev, fullname: { firstname: firstName, lastname: lastName }, email }))
    } else {
      setUser(prev => ({ ...prev, fullname: { firstname: firstName, lastname: lastName }, email }))
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const initials = ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase() || (isCaptain ? 'C' : 'U')
  const homeRoute = isCaptain ? '/captain-home' : '/home'

  return (
    <div className='min-h-screen bg-gray-50 font-sans'>
      {/* Header */}
      <header className='bg-white border-b border-gray-100 sticky top-0 z-10'>
        <div className='max-w-lg mx-auto px-4 py-3 flex items-center gap-3'>
          <button
            onClick={() => navigate(homeRoute)}
            className='h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0'
          >
            <i className="ri-arrow-left-s-line text-lg text-gray-700"></i>
          </button>
          <h1 className='text-lg font-bold text-gray-900'>My Profile</h1>
          <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${isCaptain ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
            {isCaptain ? 'Captain' : 'Rider'}
          </span>
        </div>
      </header>

      <div className='max-w-lg mx-auto px-4 py-6 space-y-4'>
        {/* Avatar Card */}
        <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4'>
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0 ${isCaptain ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
            {initials}
          </div>
          <div className='flex-1 min-w-0'>
            <h2 className='text-xl font-bold text-gray-900 capitalize truncate'>
              {firstName} {lastName}
            </h2>
            <p className='text-sm text-gray-400 truncate'>{email}</p>
            <div className='flex items-center gap-1 mt-1'>
              <i className="ri-star-fill text-yellow-400 text-xs"></i>
              <span className='text-xs text-gray-500 font-medium'>4.9 rating</span>
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
          <h3 className='text-sm font-bold text-gray-500 uppercase tracking-wider mb-4'>Personal Information</h3>
          <form onSubmit={handleSave} className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs font-semibold text-gray-500 mb-1.5'>First Name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-all text-sm placeholder:text-gray-300'
                  type='text'
                  placeholder='First name'
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-500 mb-1.5'>Last Name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-all text-sm placeholder:text-gray-300'
                  type='text'
                  placeholder='Last name'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-500 mb-1.5'>Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-all text-sm placeholder:text-gray-300'
                type='email'
                placeholder='Email'
              />
            </div>

            {saved && (
              <div className='flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 py-2.5 px-4 rounded-xl text-sm font-medium'>
                <i className="ri-checkbox-circle-fill text-green-500"></i>
                Profile updated successfully!
              </div>
            )}

            <button
              type='submit'
              className='w-full bg-black text-white font-bold py-3.5 rounded-xl text-sm hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
            >
              <i className="ri-save-line"></i> Save Changes
            </button>
          </form>
        </div>

        {/* Vehicle info for captains */}
        {isCaptain && captain?.vehicle && (
          <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
            <h3 className='text-sm font-bold text-gray-500 uppercase tracking-wider mb-4'>Vehicle Details</h3>
            <div className='grid grid-cols-2 gap-3'>
              {[
                { label: 'Plate Number', value: captain.vehicle.plate?.toUpperCase() },
                { label: 'Vehicle Type', value: captain.vehicle.vehicleType },
                { label: 'Color', value: captain.vehicle.color },
                { label: 'Capacity', value: `${captain.vehicle.capacity} seats` },
              ].map((item, i) => (
                <div key={i} className='bg-gray-50 rounded-xl p-3'>
                  <p className='text-xs text-gray-400 mb-0.5'>{item.label}</p>
                  <p className='text-sm font-semibold text-gray-800 capitalize'>{item.value || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem('token')
            navigate('/')
          }}
          className='w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 border border-red-100 font-semibold py-3 rounded-xl text-sm hover:bg-red-100 transition-colors'
        >
          <i className="ri-logout-box-r-line"></i>
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Profile
