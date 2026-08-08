import React from 'react'

const LookingForDriver = (props) => {
    return (
        <div>
            <h5
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => props.setVehicleFound(false)}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-bold mb-6'>Finding your Captain</h3>

            {/* Animated pulse / searching indicator */}
            <div className='flex flex-col items-center my-6'>
                <div className='relative'>
                    <div className='h-20 w-20 rounded-full bg-black/5 animate-ping absolute'></div>
                    <div className='h-20 w-20 rounded-full bg-black flex items-center justify-center relative z-10'>
                        <i className="ri-car-fill text-white text-3xl"></i>
                    </div>
                </div>
                <p className='mt-5 text-gray-500 text-sm font-medium animate-pulse'>Connecting you with a captain nearby...</p>
            </div>

            <div className='w-full bg-gray-50 rounded-2xl overflow-hidden mb-4'>
                <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                    <div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-circle-fill text-green-500 text-xs"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400 mb-0.5'>Pickup</p>
                        <p className='font-semibold text-gray-800'>{props.pickup}</p>
                    </div>
                </div>
                <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                    <div className='h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-map-pin-fill text-red-500 text-xs"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400 mb-0.5'>Destination</p>
                        <p className='font-semibold text-gray-800'>{props.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-4'>
                    <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                        <i className="ri-money-rupee-circle-fill text-blue-500 text-xs"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400 mb-0.5'>Fare</p>
                        <p className='font-bold text-gray-800 text-lg'>₹{props.fare[props.vehicleType]}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver