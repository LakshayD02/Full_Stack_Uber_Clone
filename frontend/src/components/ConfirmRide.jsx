import React from 'react'

const ConfirmRide = (props) => {
    const vehicleImages = {
        car: 'https://cdn-icons-png.flaticon.com/512/3202/3202003.png',
        moto: 'https://cdn-icons-png.flaticon.com/512/3097/3097136.png',
        auto: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png',
    }
    const vehicleNames = { car: 'RideX Go', moto: 'Moto', auto: 'RideX Auto' }

    return (
        <div>
            <h5
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => props.setConfirmRidePanel(false)}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-bold mb-4'>Confirm your Ride</h3>

            <div className='flex flex-col items-center gap-4'>
                <div className='bg-gray-50 rounded-2xl p-4 w-full flex items-center justify-between'>
                    <div>
                        <p className='text-xs text-gray-400 uppercase tracking-wider mb-1'>{vehicleNames[props.vehicleType] || 'Vehicle'}</p>
                        <p className='text-2xl font-black'>₹{props.fare && props.fare[props.vehicleType] ? props.fare[props.vehicleType] : '--'}</p>
                        <p className='text-xs text-gray-400'>Cash · Upfront price</p>
                    </div>
                    <img
                        className='h-16 w-20 object-contain'
                        src={vehicleImages[props.vehicleType] || vehicleImages.car}
                        alt='vehicle'
                    />
                </div>

                <div className='w-full bg-gray-50 rounded-2xl overflow-hidden'>
                    <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                        <div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                            <i className="ri-circle-fill text-green-500 text-xs"></i>
                        </div>
                        <div>
                            <p className='text-xs text-gray-400 mb-0.5'>Pickup</p>
                            <p className='font-semibold text-gray-800'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-4 p-4'>
                        <div className='h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                            <i className="ri-map-pin-fill text-red-500 text-xs"></i>
                        </div>
                        <div>
                            <p className='text-xs text-gray-400 mb-0.5'>Destination</p>
                            <p className='font-semibold text-gray-800'>{props.destination}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        props.setVehicleFound(true)
                        props.setConfirmRidePanel(false)
                        props.createRide()
                    }}
                    className='w-full bg-black text-white font-bold py-4 rounded-2xl text-lg hover:bg-gray-900 transition-colors active:scale-98'
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide