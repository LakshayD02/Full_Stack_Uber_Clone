import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const UserLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
            headers: { Authorization: `Bearer ${token}` }
        }).finally(() => {
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            navigate('/login')
        })
    }, [navigate])

    return (
        <div className='h-screen flex items-center justify-center bg-black text-white'>
            <div className='flex flex-col items-center gap-3'>
                <div className='w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                <p className='text-sm text-gray-400'>Logging out...</p>
            </div>
        </div>
    )
}

export default UserLogout
