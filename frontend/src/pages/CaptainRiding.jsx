import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import { SocketContext } from '../context/SocketContext'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const [paymentReceived, setPaymentReceived] = useState(false)
    const [showPaymentAlert, setShowPaymentAlert] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride
    const { socket } = useContext(SocketContext)

    useEffect(() => {
        const handlePaymentReceived = () => {
            setPaymentReceived(true)
            setShowPaymentAlert(true)
            setFinishRidePanel(true)

            // Browser notification
            const notifBody = `Rider confirmed ₹${rideData?.fare} cash. Tap to confirm and finish ride.`
            if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                    new Notification('💰 Payment Received!', { body: notifBody })
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(perm => {
                        if (perm === 'granted') new Notification('💰 Payment Received!', { body: notifBody })
                    })
                }
            }
        }
        socket.on('payment-received', handlePaymentReceived)
        return () => socket.off('payment-received', handlePaymentReceived)
    }, [socket, rideData])

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, { transform: 'translateY(0)' })
        } else {
            gsap.to(finishRidePanelRef.current, { transform: 'translateY(100%)' })
        }
    }, [finishRidePanel])

    return (
        <div className='h-screen flex flex-col overflow-hidden'>

            {/* Payment Alert Toast Banner */}
            {showPaymentAlert && (
                <div className='fixed top-4 left-4 right-4 z-[600]'>
                    <div className='bg-green-500 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3'>
                        <div className='h-11 w-11 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0 animate-bounce'>
                            <i className="ri-money-rupee-circle-fill text-xl"></i>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='font-black text-base leading-tight'>Payment Received! 💰</p>
                            <p className='text-green-100 text-xs mt-0.5'>Rider paid ₹{rideData?.fare} cash — confirm to finish ride</p>
                        </div>
                        <button
                            onClick={() => setShowPaymentAlert(false)}
                            className='h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 hover:bg-white/30 active:scale-95 transition-all'
                        >
                            <i className="ri-close-line text-lg"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Top — Map */}
            <div className='h-[75%] relative'>
                <div className='fixed p-4 top-0 left-0 right-0 z-10 flex items-center justify-between'>
                    <img className='w-16 filter drop-shadow-md' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                    <Link to='/captain-home' className='h-10 w-10 bg-white shadow-lg flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'>
                        <i className="text-lg font-medium ri-home-5-line text-gray-700"></i>
                    </Link>
                </div>
                <LiveTracking />
            </div>

            {/* Bottom controls */}
            <div
                className={`h-[25%] rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] relative cursor-pointer flex flex-col justify-center px-6 transition-all hover:-translate-y-1 ${paymentReceived ? 'bg-green-400' : 'bg-yellow-400'}`}
                onClick={() => setFinishRidePanel(true)}
            >
                <h5 className='absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/10 rounded-full'></h5>

                {paymentReceived ? (
                    <div className='flex items-center justify-between mt-2'>
                        <div>
                            <div className='flex items-center gap-2 mb-1'>
                                <i className="ri-check-double-fill text-white text-lg"></i>
                                <h4 className='text-xl font-black text-white'>Payment Received!</h4>
                            </div>
                            <p className='text-sm font-medium text-green-900 flex items-center gap-1'>
                                <i className="ri-money-rupee-circle-fill"></i>
                                Rider paid ₹{rideData?.fare} · Tap to finish
                            </p>
                        </div>
                        <button className='bg-white text-green-700 font-black py-3 px-6 rounded-2xl shadow-xl flex items-center gap-2'>
                            Finish <i className="ri-flag-fill"></i>
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center justify-between mt-2'>
                        <div>
                            <h4 className='text-2xl font-black text-gray-900'>In Progress</h4>
                            <p className='text-sm font-medium text-yellow-800 mt-1 flex items-center gap-1'>
                                <i className="ri-map-pin-user-fill"></i> Heading to destination
                            </p>
                        </div>
                        <button className='bg-black text-white font-bold py-3 px-8 rounded-2xl shadow-xl shadow-black/20 hover:bg-gray-900 transition-colors flex items-center gap-2'>
                            Complete Trip <i className="ri-arrow-right-line"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Sliding Finish Ride Panel */}
            <div
                ref={finishRidePanelRef}
                className='fixed w-full z-[500] bottom-0 translate-y-full bg-white rounded-t-3xl shadow-[0_-20px_25px_rgba(0,0,0,0.15)] px-3 py-6 pt-10'
            >
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel}
                    paymentReceived={paymentReceived}
                />
            </div>
        </div>
    )
}

export default CaptainRiding