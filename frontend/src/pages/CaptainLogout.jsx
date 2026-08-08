import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const CaptainLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
            headers: { Authorization: `Bearer ${token}` }
        }).finally(() => {
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            navigate('/captain-login')
        })
    }, [navigate])

    return (
        <div className='h-screen flex items-center justify-center bg-black text-white'>
            <div className='flex flex-col items-center gap-3'>
                <div className='w-8 h-8 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin'></div>
                <p className='text-sm text-gray-400'>Logging out captain...</p>
            </div>
        </div>
    )
}

export default CaptainLogout