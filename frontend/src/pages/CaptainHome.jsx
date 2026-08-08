import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ride, setRide] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        if (!captain?._id) return

        const registerCaptain = () => {
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            })
        }

        registerCaptain()

        // Re-register on reconnect (critical after backend restarts)
        socket.on('connect', registerCaptain)

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        const fetchPendingRides = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/pending`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data && response.data.length > 0) {
                    const latestRide = response.data[0]
                    setRide(prev => {
                        if (!prev || prev._id !== latestRide._id) {
                            setRidePopupPanel(true)
                            return latestRide
                        }
                        return prev
                    })
                }
            } catch (err) {
                // Ignore silent polling errors
            }
        }

        const pollInterval = setInterval(fetchPendingRides, 3000)
        fetchPendingRides()

        const handleNewRide = (data) => {
            setRide(data)
            setRidePopupPanel(true)
        }

        const handleRideCancelled = (data) => {
            setRide(prev => {
                if (prev && prev._id === data.rideId) {
                    setRidePopupPanel(false)
                    setConfirmRidePopupPanel(false)
                    return null
                }
                return prev
            })
        }

        socket.on('new-ride', handleNewRide)
        socket.on('ride-cancelled', handleRideCancelled)

        return () => {
            clearInterval(locationInterval)
            clearInterval(pollInterval)
            socket.off('connect', registerCaptain)
            socket.off('new-ride', handleNewRide)
            socket.off('ride-cancelled', handleRideCancelled)
        }
    }, [captain, socket])

    async function confirmRide() {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: ride._id,
                captainId: captain._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            setRidePopupPanel(false)
            setConfirmRidePopupPanel(true)
        } catch (err) {
            console.error('Error confirming ride:', err)
        }
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen flex flex-col justify-between overflow-hidden relative bg-slate-100'>
            {/* Modern Floating Captain Top Bar */}
            <div className='fixed top-3 left-3 right-3 z-50 flex items-center justify-between px-4 py-2.5 bg-white/85 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 transition-all'>
                <div className='flex items-center gap-3'>
                    <span className='text-lg font-black tracking-tight text-gray-900'>Ride<span className='text-blue-500'>X</span></span>
                    <span className='h-4 w-px bg-gray-200'></span>
                    <div className='flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-200'>
                        <span className='h-2 w-2 rounded-full bg-green-500 animate-pulse'></span>
                        <span className='text-[11px] font-extrabold text-green-700 uppercase tracking-wider'>Captain Online</span>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <Link
                        to='/captain-profile'
                        className='h-9 w-9 bg-gray-100/80 hover:bg-black hover:text-white flex items-center justify-center rounded-xl transition-all duration-200 text-gray-700 shadow-sm'
                        title='Profile Settings'
                    >
                        <i className="ri-user-settings-line text-sm"></i>
                    </Link>
                    <Link
                        to='/captain/logout'
                        className='h-9 w-9 bg-red-50 hover:bg-red-500 hover:text-white flex items-center justify-center rounded-xl transition-all duration-200 text-red-600 shadow-sm'
                        title='Log out'
                    >
                        <i className="ri-logout-box-r-line text-sm"></i>
                    </Link>
                </div>
            </div>

            <div className='h-[60%] pt-16 relative'>
                <LiveTracking />
            </div>

            <div className='h-[40%] p-6 bg-white rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.08)] z-10 overflow-y-auto max-w-2xl mx-auto w-full'>
                <CaptainDetails />
            </div>

            {/* Ride Request Panel */}
            <div
                ref={ridePopupPanelRef}
                className='fixed inset-x-0 bottom-0 z-50 translate-y-full max-w-lg mx-auto w-full bg-white rounded-t-3xl shadow-2xl px-4 py-8 pt-10'
            >
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            {/* OTP Confirmation Panel */}
            <div
                ref={confirmRidePopupPanelRef}
                className='fixed inset-x-0 bottom-0 z-50 translate-y-full max-w-lg mx-auto w-full bg-white rounded-t-3xl shadow-2xl px-4 py-6 pt-8 max-h-[92vh] overflow-y-auto'
            >
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    )
}

export default CaptainHome