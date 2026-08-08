import React from 'react'

const VehiclePanel = (props) => {
    const vehicles = [
        {
            key: 'car',
            name: 'UberGo',
            capacity: 4,
            eta: '2 min',
            desc: 'Affordable, compact rides',
            img: 'https://cdn-icons-png.flaticon.com/512/3202/3202003.png',
        },
        {
            key: 'moto',
            name: 'Moto',
            capacity: 1,
            eta: '3 min',
            desc: 'Affordable motorcycle rides',
            img: 'https://cdn-icons-png.flaticon.com/512/3097/3097136.png',
        },
        {
            key: 'auto',
            name: 'UberAuto',
            capacity: 3,
            eta: '3 min',
            desc: 'Affordable auto rides',
            img: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png',
        },
    ]

    return (
        <div>
            <h5
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => props.setVehiclePanel(false)}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-bold mb-5'>Choose a Vehicle</h3>

            {vehicles.map((v) => (
                <div
                    key={v.key}
                    onClick={() => {
                        props.setConfirmRidePanel(true)
                        props.selectVehicle(v.key)
                    }}
                    className='flex border-2 border-gray-100 hover:border-black active:border-black mb-3 rounded-2xl w-full p-4 items-center justify-between cursor-pointer transition-all duration-200 hover:shadow-md bg-white'
                >
                    <img className='h-12 w-16 object-contain' src={v.img} alt={v.name} />
                    <div className='ml-3 flex-1'>
                        <h4 className='font-semibold text-base flex items-center gap-1.5'>
                            {v.name}
                            <span className='flex items-center gap-0.5 text-gray-500 font-normal text-sm'>
                                <i className="ri-user-3-fill text-xs"></i>{v.capacity}
                            </span>
                        </h4>
                        <p className='text-xs text-gray-500 flex items-center gap-1'>
                            <i className="ri-time-line"></i> {v.eta} away
                        </p>
                        <p className='text-xs text-gray-400'>{v.desc}</p>
                    </div>
                    <div className='text-right'>
                        <h2 className='text-lg font-bold text-gray-900'>
                            {props.fare && props.fare[v.key] ? `₹${props.fare[v.key]}` : '₹--'}
                        </h2>
                        <p className='text-xs text-gray-400'>Cash</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default VehiclePanel