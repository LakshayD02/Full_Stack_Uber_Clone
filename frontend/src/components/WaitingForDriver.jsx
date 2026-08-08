import React from 'react'

const WaitingForDriver = (props) => {
    return (
        <div>
            <h5
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => props.setWaitingForDriver(false)}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-xl font-bold mb-4'>Captain is on the way!</h3>

            {/* Driver Card */}
            <div className='bg-gray-50 rounded-2xl p-4 mb-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <img
                            className='h-14 w-14 rounded-full object-cover border-2 border-black'
                            src='https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg'
                            alt='captain'
                        />
                        <div>
                            <h2 className='text-base font-bold capitalize'>{props.ride?.captain.fullname.firstname} {props.ride?.captain.fullname.lastname}</h2>
                            <p className='text-sm text-gray-500'>{props.ride?.captain.vehicle.vehicleType} · {props.ride?.captain.vehicle.color}</p>
                            <div className='flex items-center gap-1 text-yellow-500'>
                                <i className="ri-star-fill text-xs"></i>
                                <span className='text-xs font-medium text-gray-700'>4.9</span>
                            </div>
                        </div>
                    </div>
                    <div className='text-right'>
                        <h4 className='text-xl font-black tracking-wider'>{props.ride?.captain.vehicle.plate}</h4>
                        <p className='text-xs text-gray-400'>Vehicle number</p>
                    </div>
                </div>

                {/* OTP Box */}
                <div className='mt-4 bg-black text-white rounded-xl p-3 flex items-center justify-between'>
                    <div>
                        <p className='text-xs text-gray-400'>Share this OTP with your captain</p>
                        <h2 className='text-2xl font-black tracking-[0.4em] mt-1'>{props.ride?.otp}</h2>
                    </div>
                    <i className="ri-key-2-fill text-3xl text-yellow-400"></i>
                </div>
            </div>

            <div className='w-full bg-white border border-gray-100 rounded-2xl overflow-hidden'>
                <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                    <div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-circle-fill text-green-500 text-xs"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400 mb-0.5'>Pickup</p>
                        <p className='font-semibold text-gray-800'>{props.ride?.pickup}</p>
                    </div>
                </div>
                <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                    <div className='h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <i className="ri-map-pin-fill text-red-500 text-xs"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400 mb-0.5'>Destination</p>
                        <p className='font-semibold text-gray-800'>{props.ride?.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-4'>
                    <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                        <i className="ri-money-rupee-circle-fill text-blue-500 text-xs"></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400 mb-0.5'>Fare</p>
                        <p className='font-bold text-gray-800 text-lg'>₹{props.ride?.fare} <span className='text-xs font-normal text-gray-400'>· Cash</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WaitingForDriver