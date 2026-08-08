import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FinishRide = ({ ride, setFinishRidePanel, paymentReceived }) => {
    const navigate = useNavigate()

    async function endRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
                rideId: ride._id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            if (response.status === 200) {
                navigate('/captain-home')
            }
        } catch (err) {
            console.error('Error ending ride:', err)
        }
    }

    return (
        <div>
            <h5
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => setFinishRidePanel(false)}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className='text-2xl font-bold mb-5'>Finish Ride</h3>

            {/* Payment status banner */}
            {paymentReceived ? (
                <div className='flex items-center gap-3 p-4 bg-green-50 border-2 border-green-400 rounded-2xl mb-4'>
                    <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                        <i className="ri-check-double-fill text-green-500 text-xl"></i>
                    </div>
                    <div>
                        <p className='font-bold text-green-700 text-sm'>Payment Received!</p>
                        <p className='text-xs text-green-600'>Rider has confirmed cash payment of ₹{ride?.fare}</p>
                    </div>
                    <span className='ml-auto font-black text-green-700 text-lg'>₹{ride?.fare}</span>
                </div>
            ) : (
                <div className='flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl mb-4'>
                    <div className='h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0'>
                        <i className="ri-time-fill text-yellow-500 text-xl"></i>
                    </div>
                    <div>
                        <p className='font-bold text-yellow-700 text-sm'>Awaiting Payment</p>
                        <p className='text-xs text-yellow-600'>Ask rider to confirm ₹{ride?.fare} cash payment</p>
                    </div>
                </div>
            )}

            {/* Rider info */}
            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4 border border-gray-100'>
                <div className='flex items-center gap-3'>
                    <div className='h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300'>
                        <i className="ri-user-3-fill text-gray-400 text-xl"></i>
                    </div>
                    <div>
                        <h2 className='text-base font-bold capitalize'>{ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}</h2>
                        <p className='text-xs text-gray-500'>Rider</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-xs text-gray-400'>Total fare</p>
                    <h5 className='text-xl font-black text-gray-900'>₹{ride?.fare}</h5>
                </div>
            </div>

            {/* Ride details */}
            <div className='w-full bg-gray-50 rounded-2xl overflow-hidden mb-6 border border-gray-100'>
                <div className='flex items-start gap-4 p-3.5 border-b border-gray-100'>
                    <div className='h-7 w-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-circle-fill text-green-500 text-[10px]"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400'>Pickup</p>
                        <p className='font-semibold text-gray-800 text-sm'>{ride?.pickup}</p>
                    </div>
                </div>
                <div className='flex items-start gap-4 p-3.5 border-b border-gray-100'>
                    <div className='h-7 w-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-map-pin-fill text-red-500 text-[10px]"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400'>Destination</p>
                        <p className='font-semibold text-gray-800 text-sm'>{ride?.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-3.5'>
                    <div className='h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                        <i className="ri-money-rupee-circle-fill text-blue-500 text-[10px]"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400'>Payment</p>
                        <p className='font-bold text-gray-800'>₹{ride?.fare} · Cash</p>
                    </div>
                    {paymentReceived && (
                        <span className='ml-auto bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider'>Paid</span>
                    )}
                </div>
            </div>

            {paymentReceived ? (
                <button
                    onClick={endRide}
                    className='w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg transition-all'
                >
                    <i className="ri-flag-fill"></i> Confirm & Finish Ride
                </button>
            ) : (
                <div className='space-y-3'>
                    <button
                        onClick={endRide}
                        className='w-full bg-gray-900 hover:bg-black active:scale-[0.98] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-base transition-all'
                    >
                        <i className="ri-flag-fill"></i> End Ride (Cash not confirmed yet)
                    </button>
                    <p className='text-center text-xs text-gray-400'>Wait for rider to pay before finishing</p>
                </div>
            )}
        </div>
    )
}

export default FinishRide