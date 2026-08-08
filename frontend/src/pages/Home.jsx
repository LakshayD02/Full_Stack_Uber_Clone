import React, { useEffect, useRef, useState, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)

    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)
    const [isFindingFare, setIsFindingFare] = useState(false)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    // Socket setup + reconnect logic
    useEffect(() => {
        const registerUser = () => {
            socket.emit("join", { userType: "user", userId: user._id })
        }
        registerUser()
        socket.on('connect', registerUser)

        const handleRideConfirmed = (ride) => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        }
        const handleRideStarted = (ride) => {
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } })
        }

        socket.on('ride-confirmed', handleRideConfirmed)
        socket.on('ride-started', handleRideStarted)

        return () => {
            socket.off('connect', registerUser)
            socket.off('ride-confirmed', handleRideConfirmed)
            socket.off('ride-started', handleRideStarted)
        }
    }, [user, socket, navigate])

    // Location search handlers
    const fetchSuggestions = async (input) => {
        if (!input || input.length < 2) return []
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            return response.data || []
        } catch {
            return [
                `${input}, Connaught Place, New Delhi`,
                `${input}, Cyber Hub, Gurugram`,
                `${input}, Hauz Khas Village, New Delhi`,
                `${input}, Indiranagar, Bengaluru`,
            ]
        }
    }

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        const suggestions = await fetchSuggestions(e.target.value)
        setPickupSuggestions(suggestions)
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        const suggestions = await fetchSuggestions(e.target.value)
        setDestinationSuggestions(suggestions)
    }

    const submitHandler = (e) => e.preventDefault()

    // GSAP animations
    useGSAP(() => {
        if (panelOpen) {
            gsap.to(panelRef.current, { height: '70%', padding: 24 })
            gsap.to(panelCloseRef.current, { opacity: 1 })
        } else {
            gsap.to(panelRef.current, { height: '0%', padding: 0 })
            gsap.to(panelCloseRef.current, { opacity: 0 })
        }
    }, [panelOpen])

    useGSAP(() => {
        gsap.to(vehiclePanelRef.current, { transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)' })
    }, [vehiclePanel])

    useGSAP(() => {
        gsap.to(confirmRidePanelRef.current, { transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)' })
    }, [confirmRidePanel])

    useGSAP(() => {
        gsap.to(vehicleFoundRef.current, { transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)' })
    }, [vehicleFound])

    useGSAP(() => {
        gsap.to(waitingForDriverRef.current, { transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)' })
    }, [waitingForDriver])

    async function findTrip() {
        setIsFindingFare(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setFare(response.data)
            setVehiclePanel(true)
            setPanelOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setIsFindingFare(false)
        }
    }

    async function createRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            if (response.data) {
                setRide(response.data)
            }
        } catch (err) {
            console.error("Error creating ride:", err)
        }
    }

    async function handleCancelRide() {
        if (ride?._id) {
            try {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/cancel`, {
                    rideId: ride._id
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
            } catch (err) {
                console.error("Error cancelling ride:", err)
            }
        }
        setVehicleFound(false)
        setConfirmRidePanel(false)
        setVehiclePanel(false)
        setRide(null)
    }

    const getCurrentLocation = () => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords
            try {
                const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                if (res.data && res.data.display_name) {
                    setPickup(res.data.display_name)
                } else {
                    setPickup(`Current Location (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`)
                }
            } catch {
                setPickup(`Current Location (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`)
            }
        })
    }

    return (
        <div className='h-screen relative overflow-hidden bg-slate-100'>
            {/* Modern Floating Top Navigation Bar */}
            <div className='fixed top-3 left-3 right-3 z-50 flex items-center justify-between px-4 py-2.5 bg-white/85 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 transition-all'>
                <div className='flex items-center gap-3'>
                    <span className='text-lg font-black tracking-tight text-gray-900'>Ride<span className='text-blue-500'>X</span></span>
                    <span className='h-4 w-px bg-gray-200'></span>
                    <span className='text-xs font-bold text-gray-700 hidden sm:inline-block'>Ride Easy</span>
                </div>

                <div className='flex items-center gap-2'>
                    <div className='text-right hidden sm:block mr-1'>
                        <p className='text-[10px] uppercase tracking-wider text-gray-400 font-semibold'>Logged in as</p>
                        <p className='text-xs font-bold capitalize text-gray-800'>{user?.fullname?.firstname || 'Rider'}</p>
                    </div>
                    <Link
                        to='/profile'
                        className='h-9 w-9 bg-gray-100/80 hover:bg-black hover:text-white flex items-center justify-center rounded-xl transition-all duration-200 text-gray-700 shadow-sm'
                        title='Profile Settings'
                    >
                        <i className="ri-user-3-line text-sm"></i>
                    </Link>
                    <Link
                        to='/user/logout'
                        className='h-9 w-9 bg-red-50 hover:bg-red-500 hover:text-white flex items-center justify-center rounded-xl transition-all duration-200 text-red-600 shadow-sm'
                        title='Log out'
                    >
                        <i className="ri-logout-box-r-line text-sm"></i>
                    </Link>
                </div>
            </div>

            {/* Interactive Map View */}
            <div className='h-screen w-screen pt-16'>
                <LiveTracking hideControls={panelOpen} />
            </div>

            {/* Bottom Input Drawer — hidden when any overlay panel is open */}
            <div className={`flex flex-col justify-end h-screen absolute top-0 w-full pointer-events-none transition-all duration-300 ${vehiclePanel || confirmRidePanel || vehicleFound || waitingForDriver ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
                <div className='pointer-events-auto h-auto p-5 bg-white/95 backdrop-blur-xl relative shadow-[0_-15px_40px_rgba(0,0,0,0.12)] rounded-t-3xl border-t border-white/40'>
                    {/* Grab handle indicator */}
                    <div className='w-12 h-1 bg-gray-300/80 rounded-full mx-auto mb-4'></div>

                    <h5
                        ref={panelCloseRef}
                        onClick={() => setPanelOpen(false)}
                        className='absolute opacity-0 right-6 top-5 text-2xl cursor-pointer text-gray-400 hover:text-black'
                    >
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>

                    <div className='flex items-center justify-between mb-4'>
                        <div>
                            <h4 className='text-xl font-black text-gray-900 leading-tight'>Where to today?</h4>
                            <p className='text-xs text-gray-400'>Select route or search destination</p>
                        </div>
                        <button
                            onClick={getCurrentLocation}
                            type='button'
                            className='text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 active:scale-95 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm'
                        >
                            <i className="ri-crosshair-2-fill text-green-600 text-sm"></i> Current Location
                        </button>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-2.5 relative'>
                        <div className="absolute h-10 w-0.5 top-6 left-4 bg-gray-900 rounded-full z-10"></div>

                        <div className='relative'>
                            <div className='absolute left-3.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-black z-10 ring-4 ring-black/10'></div>
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('pickup')
                                }}
                                value={pickup}
                                onChange={handlePickupChange}
                                className='bg-gray-50 pl-10 pr-4 py-3.5 text-sm rounded-2xl w-full border border-gray-200 focus:border-black focus:bg-white focus:outline-none transition-all text-gray-900 font-semibold placeholder:text-gray-400 shadow-inner'
                                type="text"
                                placeholder='Add a pickup location'
                            />
                        </div>

                        <div className='relative'>
                            <div className='absolute left-3.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-sm bg-gray-600 z-10'></div>
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('destination')
                                }}
                                value={destination}
                                onChange={handleDestinationChange}
                                className='bg-gray-50 pl-10 pr-4 py-3.5 text-sm rounded-2xl w-full border border-gray-200 focus:border-black focus:bg-white focus:outline-none transition-all text-gray-900 font-semibold placeholder:text-gray-400 shadow-inner'
                                type="text"
                                placeholder='Enter your destination'
                            />
                        </div>
                    </form>

                    {/* Quick Location Shortcuts */}
                    {!panelOpen && (
                        <div className='flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1'>
                            {[
                                { icon: 'ri-map-pin-2-line', label: 'Connaught Place' },
                                { icon: 'ri-building-4-line', label: 'Cyber Hub' },
                                { icon: 'ri-plane-line', label: 'IGI Airport' },
                                { icon: 'ri-shopping-bag-3-line', label: 'Hauz Khas' }
                            ].map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setDestination(`${chip.label}, New Delhi`)
                                        setPanelOpen(true)
                                        setActiveField('destination')
                                    }}
                                    className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-gray-700 rounded-xl text-xs font-semibold whitespace-nowrap transition-all'
                                >
                                    <i className={`${chip.icon} text-xs`}></i>
                                    {chip.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={findTrip}
                        disabled={!pickup || !destination || isFindingFare}
                        className={`mt-4 py-4 rounded-2xl w-full font-black text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                            pickup && destination && !isFindingFare
                                ? 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {isFindingFare ? (
                            <><div className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin'></div> Calculating fare...</>
                        ) : (
                            <><i className="ri-search-line font-bold"></i> Find Trip</>
                        )}
                    </button>
                </div>

                {/* Search Suggestion drawer */}
                <div ref={panelRef} className='pointer-events-auto bg-white h-0 overflow-y-auto'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>

            {/* Vehicle Selection Panel */}
            <div ref={vehiclePanelRef} className='fixed inset-x-0 max-w-lg mx-auto w-full z-[100] bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-4 py-8 pt-10'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel}
                />
            </div>

            {/* Confirm Ride Panel */}
            <div ref={confirmRidePanelRef} className='fixed inset-x-0 max-w-lg mx-auto w-full z-[100] bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-4 py-6 pt-10'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehicleFound={setVehicleFound}
                />
            </div>

            {/* Looking For Driver Panel */}
            <div ref={vehicleFoundRef} className='fixed inset-x-0 max-w-lg mx-auto w-full z-[100] bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-4 py-6 pt-10'>
                <LookingForDriver
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}
                    onCancel={handleCancelRide}
                />
            </div>

            {/* Waiting For Driver Panel */}
            <div ref={waitingForDriverRef} className='fixed inset-x-0 max-w-lg mx-auto w-full z-[100] bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-4 py-6 pt-10 max-h-[90vh] overflow-y-auto'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver}
                />
            </div>
        </div>
    )
}

export default Home