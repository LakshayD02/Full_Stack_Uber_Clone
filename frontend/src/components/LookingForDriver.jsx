import React from 'react'

const LookingForDriver = (props) => {
    const fareAmount = props.ride?.fare || (props.fare && props.vehicleType && props.fare[props.vehicleType] ? props.fare[props.vehicleType] : null) || '--'
    const pickupAddress = props.ride?.pickup || props.pickup || 'Pickup location'
    const destAddress = props.ride?.destination || props.destination || 'Destination location'

    return (
        <div className='flex flex-col max-h-[82vh] overflow-y-auto pb-2'>
            <h5
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => {
                    if (props.onCancel) props.onCancel()
                    else props.setVehicleFound(false)
                }}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-xl font-bold mb-3 text-center'>Finding your Captain</h3>

            {/* Animated pulse / searching indicator */}
            <div className='flex flex-col items-center my-3'>
                <div className='relative'>
                    <div className='h-16 w-16 rounded-full bg-black/5 animate-ping absolute'></div>
                    <div className='h-16 w-16 rounded-full bg-black flex items-center justify-center relative z-10'>
                        <i className="ri-car-fill text-white text-2xl"></i>
                    </div>
                </div>
                <p className='mt-3 text-gray-500 text-xs font-medium animate-pulse'>Connecting you with a captain nearby...</p>
            </div>

            <div className='w-full bg-gray-50 rounded-2xl overflow-hidden mb-3 border border-gray-100'>
                <div className='flex items-start gap-3 p-3 border-b border-gray-100'>
                    <div className='h-7 w-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-circle-fill text-green-500 text-xs"></i>
                    </div>
                    <div className='min-w-0 flex-1'>
                        <p className='text-[10px] uppercase font-bold text-gray-400 mb-0.5'>Pickup</p>
                        <p className='font-semibold text-gray-800 text-xs line-clamp-2'>{pickupAddress}</p>
                    </div>
                </div>
                <div className='flex items-start gap-3 p-3 border-b border-gray-100'>
                    <div className='h-7 w-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-map-pin-fill text-red-500 text-xs"></i>
                    </div>
                    <div className='min-w-0 flex-1'>
                        <p className='text-[10px] uppercase font-bold text-gray-400 mb-0.5'>Destination</p>
                        <p className='font-semibold text-gray-800 text-xs line-clamp-2'>{destAddress}</p>
                    </div>
                </div>
                <div className='flex items-center gap-3 p-3'>
                    <div className='h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                        <i className="ri-money-rupee-circle-fill text-blue-500 text-xs"></i>
                    </div>
                    <div>
                        <p className='text-[10px] uppercase font-bold text-gray-400 mb-0.5'>Fare</p>
                        <p className='font-bold text-gray-800 text-sm'>₹{fareAmount}</p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => {
                    if (props.onCancel) {
                        props.onCancel()
                    } else {
                        props.setVehicleFound(false)
                    }
                }}
                className='w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 border border-red-200 shadow-sm active:scale-98'
            >
                <i className="ri-close-circle-line text-lg"></i> Cancel Trip
            </button>
        </div>
    )
}

export default LookingForDriver