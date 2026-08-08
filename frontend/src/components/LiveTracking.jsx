import React, { useState, useEffect } from 'react'

const defaultCenter = { lat: 28.6139, lng: 77.2090 }

const LiveTracking = ({ pickupCoords, destinationCoords, showRoute, hideControls }) => {
    const [currentPosition, setCurrentPosition] = useState(defaultCenter)
    const [carPos, setCarPos] = useState(defaultCenter)
    const [progress, setProgress] = useState(0)
    // mapType: 'm' (Roadmap), 'k' (Satellite), 'h' (Hybrid)
    const [mapType, setMapType] = useState('m')
    const [zoom, setZoom] = useState(15)

    // Get real GPS position
    useEffect(() => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                setCurrentPosition(p)
                setCarPos(p)
            },
            () => {
                setCurrentPosition(defaultCenter)
                setCarPos(defaultCenter)
            }
        )

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                setCurrentPosition(p)
            },
            () => {}
        )
        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    // Animate car smoothly along trip route
    useEffect(() => {
        if (!showRoute) return
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 1 ? 0 : prev + 0.03))
        }, 300)
        return () => clearInterval(interval)
    }, [showRoute])

    useEffect(() => {
        if (!showRoute) return
        const start = pickupCoords || currentPosition
        const end = destinationCoords || { lat: start.lat + 0.03, lng: start.lng + 0.03 }

        setCarPos({
            lat: start.lat + (end.lat - start.lat) * progress,
            lng: start.lng + (end.lng - start.lng) * progress,
        })
    }, [progress, pickupCoords, destinationCoords, showRoute, currentPosition])

    const center = showRoute ? carPos : currentPosition

    const handleRecenter = () => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition((pos) => {
            setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            setZoom(16)
        })
    }

    const zoomIn = () => setZoom(z => Math.min(z + 1, 19))
    const zoomOut = () => setZoom(z => Math.max(z - 1, 10))

    // Google Maps embed URL with dynamic map type and zoom level
    const mapUrl = `https://maps.google.com/maps?q=${center.lat},${center.lng}&t=${mapType}&z=${zoom}&output=embed`

    return (
        <div className='relative w-full h-full min-h-[300px] bg-slate-950 overflow-hidden group'>
            {/* Interactive Map View */}
            <iframe
                title='Live Tracking Map'
                width='100%'
                height='100%'
                style={{ border: 0, minHeight: '100%' }}
                loading='lazy'
                allowFullScreen
                src={mapUrl}
                className='w-full h-full border-0 filter contrast-[1.04] brightness-[0.98] transition-all duration-300'
            ></iframe>

            {/* Map Mode Selector Bar (Hidden when searching locations) */}
            <div className={`absolute top-3 left-3 z-30 bg-black/90 backdrop-blur-xl border border-white/20 p-1 rounded-2xl flex items-center gap-1 shadow-2xl transition-opacity duration-200 ${hideControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {[
                    { id: 'm', label: 'Map', icon: 'ri-map-2-fill', color: 'text-gray-900' },
                    { id: 'k', label: 'Satellite', icon: 'ri-earth-fill', color: 'text-blue-500' },
                    { id: 'h', label: 'Hybrid', icon: 'ri-road-map-fill', color: 'text-emerald-500' },
                ].map(type => (
                    <button
                        key={type.id}
                        onClick={() => setMapType(type.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                            mapType === type.id
                                ? 'bg-white text-black shadow-lg scale-105'
                                : 'text-gray-300 hover:text-white hover:bg-white/15'
                        }`}
                    >
                        <i className={`${type.icon} text-sm ${mapType === type.id ? type.color : ''}`}></i>
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default LiveTracking