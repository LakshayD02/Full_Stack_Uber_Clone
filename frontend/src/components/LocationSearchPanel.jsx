import React from 'react'

const LocationSearchPanel = ({ suggestions, setPickup, setDestination, activeField, setPanelOpen, setVehiclePanel }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        // Collapse the panel after selection
        setPanelOpen(false)
    }

    return (
        <div className='py-1'>
            {suggestions.length === 0 && (
                <div className='flex flex-col items-center justify-center py-8 text-gray-400'>
                    <i className="ri-search-line text-3xl mb-2"></i>
                    <p className='text-sm'>Start typing to search locations...</p>
                </div>
            )}
            {suggestions.map((elem, idx) => (
                <div
                    key={idx}
                    onClick={() => handleSuggestionClick(elem)}
                    className='flex gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 items-center cursor-pointer transition-colors active:bg-gray-100'
                >
                    <div className='h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                        <i className="ri-map-pin-2-fill text-gray-500 text-base"></i>
                    </div>
                    <div className='flex-1 min-w-0'>
                        {/* Show first part as title, rest as subtitle (like Uber) */}
                        <p className='font-medium text-gray-800 text-sm truncate'>
                            {elem.split(',')[0]}
                        </p>
                        <p className='text-xs text-gray-400 truncate mt-0.5'>
                            {elem.split(',').slice(1).join(',').trim() || 'Tap to select location'}
                        </p>
                    </div>
                    <i className="ri-arrow-right-up-line text-gray-300 text-sm flex-shrink-0"></i>
                </div>
            ))}
        </div>
    )
}

export default LocationSearchPanel