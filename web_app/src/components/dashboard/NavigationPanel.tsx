import { useState } from 'react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { useVoice } from '@/contexts/VoiceContext'

interface Location {
  latitude: number
  longitude: number
  address: string
}

interface Direction {
  instruction: string
  distance: number
  duration: number
}

interface NavigationPanelProps {
  onLocationFound?: (location: Location) => void
  onDirectionsReady?: (directions: Direction[]) => void
}

export function NavigationPanel({ onLocationFound, onDirectionsReady }: NavigationPanelProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [destination, setDestination] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)
  const { speak } = useVoice()

  const handleLocationSearch = async () => {
    if (!destination.trim()) {
      speak('Please enter a destination')
      return
    }

    try {
      const response = await fetch(`/api/geocode?name=${encodeURIComponent(destination)}`)
      const data = await response.json()
      
      if (data.latitude && data.longitude) {
        const location: Location = {
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address || destination
        }
        setCurrentLocation(location)
        onLocationFound?.(location)
        speak(`Location found: ${location.address}`)
      } else {
        speak('Location not found. Please try a different search.')
      }
    } catch (error) {
      console.error('Error searching location:', error)
      speak('Error searching for location')
    }
  }

  const handleGetDirections = async () => {
    if (!currentLocation) {
      speak('Please search for a location first')
      return
    }

    setIsNavigating(true)
    speak('Getting directions...')

    try {
      // Get user's current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const response = await fetch(`/api/route?start_lat=${position.coords.latitude}&start_lon=${position.coords.longitude}&end_lat=${currentLocation.latitude}&end_lon=${currentLocation.longitude}`)
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const directions: Direction[] = data.features[0].properties.segments[0].steps.map((step: any) => ({
          instruction: step.instruction,
          distance: step.distance,
          duration: step.duration
        }))

        onDirectionsReady?.(directions)
        speak(`Directions ready. ${directions.length} steps to your destination.`)
      } else {
        speak('Could not find directions to this location')
      }
    } catch (error) {
      console.error('Error getting directions:', error)
      speak('Error getting directions')
    } finally {
      setIsNavigating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="destination" className="block text-sm font-medium">
          Destination
        </label>
        <input
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination address"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex space-x-2">
        <LuxuryButton onClick={handleLocationSearch} disabled={!destination.trim()}>
          Search Location
        </LuxuryButton>
        
        <LuxuryButton 
          onClick={handleGetDirections} 
          disabled={!currentLocation || isNavigating}
          loading={isNavigating}
        >
          Get Directions
        </LuxuryButton>
      </div>

      {currentLocation && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800">Location Found</h4>
          <p className="text-sm text-green-700">{currentLocation.address}</p>
          <p className="text-xs text-green-600">
            {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  )
}
