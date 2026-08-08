import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)
    const [stats, setStats] = useState({
        todayRides: 0,
        todayEarnings: 0,
        totalRides: 0,
        totalEarnings: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/captain-stats`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                setStats(res.data)
            } catch (err) {
                // keep zeros on error
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    const statCards = [
        {
            icon: 'ri-car-fill',
            bg: 'bg-blue-50',
            iconColor: 'text-blue-500',
            value: loading ? '—' : stats.todayRides,
            label: "Today's Rides",
        },
        {
            icon: 'ri-money-rupee-circle-fill',
            bg: 'bg-green-50',
            iconColor: 'text-green-500',
            value: loading ? '—' : `₹${stats.todayEarnings}`,
            label: "Today's Earnings",
        },
        {
            icon: 'ri-history-fill',
            bg: 'bg-purple-50',
            iconColor: 'text-purple-500',
            value: loading ? '—' : stats.totalRides,
            label: 'Total Rides',
        },
        {
            icon: 'ri-trophy-fill',
            bg: 'bg-yellow-50',
            iconColor: 'text-yellow-500',
            value: loading ? '—' : `₹${stats.totalEarnings}`,
            label: 'Total Earnings',
        },
    ]

    return (
        <div>
            {/* Captain details header (without profile image/icon) */}
            <div className='flex items-center justify-between mb-4 px-1'>
                <div>
                    <h4 className='text-lg font-bold capitalize leading-tight text-gray-900'>
                        {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                    </h4>
                    <div className='flex items-center gap-1.5 mt-1'>
                        <i className="ri-star-fill text-yellow-400 text-xs"></i>
                        <span className='text-xs text-gray-600 font-medium'>4.9 · Captain</span>
                        <span className='text-gray-300 text-xs'>•</span>
                        <span className='text-xs text-green-600 font-semibold'>● Online</span>
                    </div>
                </div>
            </div>

            {/* Vehicle info */}
            <div className='flex items-center gap-3 mb-4 bg-gray-50 rounded-2xl px-3 py-2.5 border border-gray-100'>
                <div className='h-9 w-9 rounded-xl bg-black flex items-center justify-center flex-shrink-0'>
                    <i className="ri-car-fill text-white text-sm"></i>
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='font-bold text-gray-800 uppercase tracking-wider text-sm'>{captain?.vehicle?.plate}</p>
                    <p className='text-xs text-gray-500 capitalize truncate'>
                        {captain?.vehicle?.vehicleType} · {captain?.vehicle?.color} · {captain?.vehicle?.capacity} seats
                    </p>
                </div>
                <span className='bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0'>Active</span>
            </div>

            {/* 2×2 Stats grid */}
            <div className='grid grid-cols-2 gap-2.5'>
                {statCards.map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-3.5 flex items-center gap-3`}>
                        <div className='flex-shrink-0'>
                            <i className={`${s.icon} ${s.iconColor} text-2xl`}></i>
                        </div>
                        <div>
                            <p className='font-black text-gray-900 text-base leading-tight'>{s.value}</p>
                            <p className='text-[10px] text-gray-400 leading-tight mt-0.5'>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CaptainDetails