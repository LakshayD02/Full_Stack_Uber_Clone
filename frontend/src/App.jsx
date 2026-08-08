import React, { useContext, useEffect } from 'react'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import 'remixicon/fonts/remixicon.css'

// Redirects already-logged-in users away from auth pages
const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (token) {
    return <Navigate to={role === 'captain' ? '/captain-home' : '/home'} replace />
  }
  return children
}

const CaptainAuthGuard = ({ children }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (token) {
    return <Navigate to={role === 'captain' ? '/captain-home' : '/home'} replace />
  }
  return children
}

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />

        {/* Auth routes with reverse guard */}
        <Route path='/login' element={<AuthGuard><UserLogin /></AuthGuard>} />
        <Route path='/signup' element={<AuthGuard><UserSignup /></AuthGuard>} />
        <Route path='/captain-login' element={<CaptainAuthGuard><Captainlogin /></CaptainAuthGuard>} />
        <Route path='/captain-signup' element={<CaptainAuthGuard><CaptainSignup /></CaptainAuthGuard>} />
        <Route path='/forgot-password' element={<ForgotPassword />} />

        {/* Riding pages — protected with user & captain auth wrappers */}
        <Route path='/riding' element={
          <UserProtectWrapper>
            <Riding />
          </UserProtectWrapper>
        } />
        <Route path='/captain-riding' element={
          <CaptainProtectWrapper>
            <CaptainRiding />
          </CaptainProtectWrapper>
        } />

        <Route path='/profile' element={
          <UserProtectWrapper>
            <Profile />
          </UserProtectWrapper>
        } />
        <Route path='/captain-profile' element={
          <CaptainProtectWrapper>
            <Profile />
          </CaptainProtectWrapper>
        } />

        {/* Protected user routes */}
        <Route path='/home' element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
        } />
        <Route path='/user/logout' element={
          <UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
        } />

        {/* Protected captain routes */}
        <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>
        } />
        <Route path='/captain/logout' element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />
      </Routes>
    </div>
  )
}

export default App