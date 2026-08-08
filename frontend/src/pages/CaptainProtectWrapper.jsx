import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { setCaptain } = useContext(CaptainDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCaptain(response.data.captain)
                setIsLoading(false)
            }
        }).catch(err => {
            console.error('Captain auth error:', err)
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            navigate('/captain-login')
        })
    }, [ token, navigate, setCaptain ])

    if (isLoading) {
        return (
            <div className='h-screen flex flex-col items-center justify-center bg-black text-white'>
                <div className='w-12 h-12 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin mb-4'></div>
                <p className='text-yellow-400/80 text-sm font-medium'>Verifying captain session...</p>
            </div>
        )
    }

    return <>{children}</>
}

export default CaptainProtectWrapper