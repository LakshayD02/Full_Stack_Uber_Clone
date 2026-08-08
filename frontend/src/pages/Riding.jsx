import React, { useEffect, useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    // step: 'riding' | 'pay' | 'paid'
    const [step, setStep] = useState('riding')

    useEffect(() => {
        const handleRideEnded = () => {
            // Only navigate home after captain finishes the ride
            navigate('/home')
        }
        socket.on('ride-ended', handleRideEnded)
        return () => socket.off('ride-ended', handleRideEnded)
    }, [socket, navigate])

    const handlePay = () => {
        // Notify captain that payment has been made
        socket.emit('payment-made', {
            rideId: ride?._id,
            captainId: ride?.captain?._id
        })
        setStep('paid')
    }

    // Step: paid confirmation screen
    if (step === 'paid') {
        return (
            <div className='h-screen flex flex-col items-center justify-center bg-gray-50 px-6'>
                {/* Success animation */}
                <div className='mb-6 relative'>
                    <div className='h-28 w-28 rounded-full bg-green-100 flex items-center justify-center'>
                        <i className="ri-check-double-fill text-5xl text-green-500"></i>
                    </div>
                    <div className='absolute -top-1 -right-1 h-6 w-6 rounded-full bg-green-400 animate-ping'></div>
                </div>
                <h2 className='text-2xl font-black text-gray-900 mb-2 text-center'>Payment Confirmed!</h2>
                <p className='text-gray-500 text-sm text-center mb-1'>You paid <span className='font-bold text-gray-800'>₹{ride?.fare}</span> cash</p>
                <p className='text-gray-400 text-xs text-center mb-8'>Waiting for captain to confirm receipt...</p>

                {/* Ride summary */}
                <div className='w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6'>
                    <div className='flex items-center gap-3 p-4 border-b border-gray-50'>
                        <div className='h-9 w-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                            <i className="ri-circle-fill text-green-500 text-xs"></i>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-xs text-gray-400'>Pickup</p>
                            <p className='text-sm font-semibold text-gray-800 truncate'>{ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 p-4'>
                        <div className='h-9 w-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0'>
                            <i className="ri-map-pin-fill text-red-500 text-xs"></i>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-xs text-gray-400'>Destination</p>
                            <p className='text-sm font-semibold text-gray-800 truncate'>{ride?.destination}</p>
                        </div>
                    </div>
                </div>

                {/* Captain info */}
                <div className='w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3 mb-8'>
                    <div className='h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 border-2 border-gray-200'>
                        <i className="ri-user-3-fill text-gray-500 text-xl"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400'>Your Captain</p>
                        <h4 className='font-bold capitalize text-gray-900'>{ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}</h4>
                        <p className='text-xs text-gray-500 uppercase tracking-wider'>{ride?.captain?.vehicle?.plate}</p>
                    </div>
                    <div className='ml-auto flex items-center gap-1 bg-green-50 px-2.5 py-1.5 rounded-xl'>
                        <i className="ri-money-rupee-circle-fill text-green-500 text-sm"></i>
                        <span className='text-sm font-black text-green-700'>₹{ride?.fare}</span>
                    </div>
                </div>

                <div className='flex items-center gap-2 text-xs text-gray-400'>
                    <div className='h-2 w-2 rounded-full bg-yellow-400 animate-pulse'></div>
                    Captain is confirming your payment...
                </div>
            </div>
        )
    }

    // Step: pay
    if (step === 'pay') {
        return (
            <div className='h-screen flex flex-col bg-gray-50'>
                <div className='p-5 bg-white shadow-sm flex items-center gap-4 border-b border-gray-100'>
                    <button
                        onClick={() => setStep('riding')}
                        className='h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                    >
                        <i className="ri-arrow-left-s-line text-lg text-gray-700"></i>
                    </button>
                    <h2 className='text-xl font-bold'>Complete Payment</h2>
                </div>

                <div className='flex-1 overflow-y-auto p-5 space-y-4'>
                    {/* Fare summary */}
                    <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
                        <h3 className='font-bold text-base mb-4 text-gray-800'>Ride Summary</h3>
                        <div className='space-y-3 text-sm'>
                            <div className='flex justify-between text-gray-500'>
                                <span>From</span>
                                <span className='font-medium text-gray-800 text-right max-w-[200px] truncate'>{ride?.pickup}</span>
                            </div>
                            <div className='flex justify-between text-gray-500'>
                                <span>To</span>
                                <span className='font-medium text-gray-800 text-right max-w-[200px] truncate'>{ride?.destination}</span>
                            </div>
                            <div className='border-t pt-3 flex justify-between font-bold text-base'>
                                <span>Total Fare</span>
                                <span className='text-green-600 text-xl'>₹{ride?.fare}</span>
                            </div>
                        </div>
                    </div>

                    {/* Captain info */}
                    <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4'>
                        <div className='h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200'>
                            <i className="ri-user-3-fill text-gray-400 text-xl"></i>
                        </div>
                        <div>
                            <h4 className='font-bold capitalize'>{ride?.captain?.fullname?.firstname}</h4>
                            <p className='text-sm text-gray-400'>{ride?.captain?.vehicle?.vehicleType} · {ride?.captain?.vehicle?.plate}</p>
                        </div>
                    </div>

                    {/* Payment method */}
                    <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
                        <h3 className='font-bold mb-4 text-gray-800'>Payment Method</h3>
                        <div className='space-y-3'>
                            {[
                                { icon: 'ri-money-rupee-circle-fill', label: 'Cash', sub: 'Pay driver directly', color: 'text-green-500', active: true },
                                { icon: 'ri-bank-card-fill', label: 'Card', sub: 'Coming soon', color: 'text-blue-500', disabled: true },
                                { icon: 'ri-wallet-3-fill', label: 'UPI / Wallet', sub: 'Coming soon', color: 'text-purple-500', disabled: true },
                            ].map((m, i) => (
                                <div key={i} className={`flex items-center gap-4 p-3.5 rounded-xl border-2 ${m.active ? 'border-black bg-gray-50' : 'border-gray-100 opacity-40'} ${m.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <div className='h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                                        <i className={`${m.icon} text-xl ${m.color}`}></i>
                                    </div>
                                    <div className='flex-1'>
                                        <p className='font-semibold text-sm'>{m.label}</p>
                                        <p className='text-xs text-gray-400'>{m.sub}</p>
                                    </div>
                                    {m.active && <i className="ri-check-line text-black font-bold text-lg"></i>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Confirm payment */}
                <div className='p-5 bg-white border-t border-gray-100'>
                    <button
                        onClick={handlePay}
                        className='w-full bg-black text-white font-bold py-4 rounded-2xl text-base flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all'
                    >
                        <i className="ri-check-double-fill text-lg"></i>
                        Confirm Cash Payment — ₹{ride?.fare}
                    </button>
                    <p className='text-center text-xs text-gray-400 mt-3'>By confirming, you agree the cash has been paid to the captain.</p>
                </div>
            </div>
        )
    }

    // Default: riding view
    return (
        <div className='h-screen flex flex-col overflow-hidden'>
            {/* Map */}
            <div className='flex-1 relative'>
                <LiveTracking showRoute={true} />

                {/* Status badge */}
                <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur text-white px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium z-10'>
                    <span className='h-2 w-2 rounded-full bg-green-400 animate-pulse'></span>
                    Ride in progress
                </div>
            </div>

            {/* Bottom info card */}
            <div className='bg-white rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] px-5 pt-5 pb-6'>
                <div className='w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4'></div>

                {/* Enjoy trip banner */}
                <div className='bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 mb-4 flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0'>
                        <i className="ri-car-fill text-white text-xl"></i>
                    </div>
                    <div>
                        <p className='text-white font-bold'>Enjoy your trip!</p>
                        <p className='text-green-100 text-xs'>Heading to {ride?.destination?.split(',')[0]}</p>
                    </div>
                </div>

                {/* Driver card */}
                <div className='flex items-center justify-between bg-gray-50 rounded-2xl p-4 mb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300'>
                            <i className="ri-user-3-fill text-gray-400 text-xl"></i>
                        </div>
                        <div>
                            <h2 className='font-bold capitalize'>{ride?.captain?.fullname?.firstname}</h2>
                            <p className='text-xs text-gray-500'>{ride?.captain?.vehicle?.vehicleType} · {ride?.captain?.vehicle?.color}</p>
                            <div className='flex items-center gap-1 mt-0.5'>
                                <i className="ri-star-fill text-yellow-400 text-xs"></i>
                                <span className='text-xs text-gray-600 font-medium'>4.9</span>
                            </div>
                        </div>
                    </div>
                    <div className='text-right'>
                        <h4 className='text-lg font-black tracking-wider'>{ride?.captain?.vehicle?.plate}</h4>
                        <p className='text-xs text-gray-400'>Vehicle plate</p>
                    </div>
                </div>

                {/* Fare + CTA */}
                <div className='flex items-center justify-between mb-4 px-1'>
                    <div className='flex items-center gap-2'>
                        <i className="ri-map-pin-fill text-red-500 text-sm"></i>
                        <p className='text-sm text-gray-600 truncate max-w-[200px]'>{ride?.destination}</p>
                    </div>
                    <p className='font-black text-lg text-gray-900'>₹{ride?.fare}</p>
                </div>

                <button
                    onClick={() => setStep('pay')}
                    className='w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-base transition-all'
                >
                    <i className="ri-money-rupee-circle-fill text-xl"></i>
                    Pay ₹{ride?.fare}
                </button>
            </div>
        </div>
    )
}

export default Riding