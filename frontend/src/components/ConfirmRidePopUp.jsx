import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        setError('')
        if (otp.length !== 6) {
            setError('Please enter the complete 6-digit OTP.')
            return
        }
        setIsLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: { rideId: props.ride._id, otp },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: props.ride } })
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h5
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => props.setRidePopupPanel(false)}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-bold mb-4'>Confirm Ride to Start</h3>

            {/* Rider info */}
            <div className='flex items-center justify-between p-4 bg-yellow-50 border-2 border-yellow-400 rounded-2xl mb-4'>
                <div className='flex items-center gap-3'>
                    <img
                        className='h-12 w-12 rounded-full object-cover border-2 border-yellow-400'
                        src='https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg'
                        alt='rider'
                    />
                    <div>
                        <h2 className='text-base font-bold capitalize'>{props.ride?.user?.fullname?.firstname || 'Rider'} {props.ride?.user?.fullname?.lastname || ''}</h2>
                        <div className='flex items-center gap-1 text-yellow-500'>
                            <i className="ri-star-fill text-xs"></i>
                            <span className='text-xs font-medium text-gray-700'>4.8 · Rider</span>
                        </div>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-xs text-gray-400'>Distance</p>
                    <h5 className='text-lg font-bold'>
                        {props.ride?.distance ? `${(props.ride.distance / 1000).toFixed(1)} KM` : `${Math.round((props.ride?.fare || 150) / 25 * 10) / 10} KM`}
                    </h5>
                </div>
            </div>

            {/* Ride details */}
            <div className='w-full bg-gray-50 rounded-2xl overflow-hidden mb-4'>
                <div className='flex items-start gap-4 p-3 border-b border-gray-100'>
                    <div className='h-7 w-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-circle-fill text-green-500 text-[10px]"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400'>Pickup</p>
                        <p className='font-semibold text-gray-800 text-sm'>{props.ride?.pickup}</p>
                    </div>
                </div>
                <div className='flex items-start gap-4 p-3 border-b border-gray-100'>
                    <div className='h-7 w-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-map-pin-fill text-red-500 text-[10px]"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400'>Destination</p>
                        <p className='font-semibold text-gray-800 text-sm'>{props.ride?.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-3'>
                    <div className='h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                        <i className="ri-money-rupee-circle-fill text-blue-500 text-[10px]"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400'>Fare</p>
                        <p className='font-bold text-gray-800'>₹{props.ride?.fare} · Cash</p>
                    </div>
                </div>
            </div>

            {/* OTP Input */}
            <form onSubmit={submitHandler}>
                <div className='mb-3'>
                    <label className='text-sm font-medium text-gray-600 mb-2 block flex items-center gap-1'>
                        <i className="ri-key-2-fill text-yellow-500"></i>
                        Enter rider's OTP to start trip
                    </label>
                    <input
                        value={otp}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                            setOtp(val)
                            setError('')
                        }}
                        type='text'
                        inputMode='numeric'
                        maxLength={6}
                        className='bg-gray-100 px-6 py-4 font-mono text-3xl tracking-[0.5em] font-bold rounded-2xl w-full text-center border-2 border-transparent focus:border-yellow-400 focus:outline-none transition-colors'
                        placeholder='------'
                    />
                    {error && <p className='text-red-500 text-xs mt-2 text-center'>{error}</p>}
                </div>
                <button
                    type='submit'
                    disabled={isLoading || otp.length < 6}
                    className={`w-full text-lg flex justify-center items-center gap-2 font-bold p-4 rounded-2xl transition-all duration-300 ${otp.length === 6 && !isLoading ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                    {isLoading ? (
                        <><div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div> Verifying...</>
                    ) : (
                        <><i className="ri-check-double-fill"></i> Confirm & Start Ride</>
                    )}
                </button>
                <button
                    type='button'
                    onClick={() => {
                        props.setConfirmRidePopupPanel(false)
                        props.setRidePopupPanel(false)
                    }}
                    className='w-full mt-2 bg-gray-100 text-gray-600 text-sm font-semibold p-3 rounded-2xl hover:bg-gray-200 transition-colors'
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default ConfirmRidePopUp