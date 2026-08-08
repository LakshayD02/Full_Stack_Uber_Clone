import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data)
                setIsLoading(false)
            }
        }).catch(err => {
            console.error('User auth error:', err)
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            navigate('/login')
        })
    }, [ token, navigate, setUser ])

    if (isLoading) {
        return (
            <div className='h-screen flex flex-col items-center justify-center bg-black text-white'>
                <div className='w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4'></div>
                <p className='text-white/60 text-sm'>Verifying session...</p>
            </div>
        )
    }

    return <>{children}</>
}

export default UserProtectWrapper