import React from 'react'

const RidePopUp = (props) => {
    return (
        <div>
            <h5
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => props.setRidePopupPanel(false)}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>

            <div className='flex items-center gap-2 mb-4'>
                <div className='h-2 w-2 bg-green-400 rounded-full animate-pulse'></div>
                <h3 className='text-xl font-bold'>New Ride Request!</h3>
            </div>

            {/* Rider info */}
            <div className='flex items-center justify-between p-4 bg-yellow-50 border-2 border-yellow-400 rounded-2xl mb-4'>
                <div className='flex items-center gap-3'>
                    <img
                        className='h-12 w-12 rounded-full object-cover border-2 border-yellow-400'
                        src='https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg'
                        alt='rider'
                    />
                    <div>
                        <h2 className='text-base font-bold capitalize'>
                            {props.ride?.user?.fullname?.firstname || 'Rider'} {props.ride?.user?.fullname?.lastname || ''}
                        </h2>
                        <div className='flex items-center gap-1'>
                            <i className="ri-star-fill text-yellow-500 text-xs"></i>
                            <span className='text-xs text-gray-600'>4.8 · Rider</span>
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
            <div className='w-full bg-gray-50 rounded-2xl overflow-hidden mb-5'>
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

            <button
                onClick={() => {
                    props.setConfirmRidePopupPanel(true)
                    props.confirmRide()
                }}
                className='bg-green-500 hover:bg-green-600 w-full text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-2'
            >
                <i className="ri-check-fill text-xl"></i> Accept Ride
            </button>
            <button
                onClick={() => props.setRidePopupPanel(false)}
                className='w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold p-3 rounded-2xl transition-colors text-sm'
            >
                Ignore
            </button>
        </div>
    )
}

export default RidePopUp