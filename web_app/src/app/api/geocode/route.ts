import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    
    if (!name) {
      return NextResponse.json({
        success: false,
        message: 'Location name is required'
      }, { status: 400 })
    }
    
    // Mock geocoding response for demonstration
    // In production, this would call a real geocoding service like Nominatim
    const mockLocations: Record<string, any> = {
      'park': {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'Central Park, New Delhi, India'
      },
      'hospital': {
        latitude: 28.6289,
        longitude: 77.2065,
        address: 'All India Institute of Medical Sciences, New Delhi, India'
      },
      'mall': {
        latitude: 28.5562,
        longitude: 77.1000,
        address: 'DLF Mall of India, Noida, India'
      },
      'airport': {
        latitude: 28.5665,
        longitude: 77.1031,
        address: 'Indira Gandhi International Airport, New Delhi, India'
      }
    }
    
    const lowerName = name.toLowerCase()
    let result = null
    
    // Find matching location
    for (const [key, location] of Object.entries(mockLocations)) {
      if (lowerName.includes(key)) {
        result = location
        break
      }
    }
    
    // If no match found, return a default location
    if (!result) {
      result = {
        latitude: 28.6139,
        longitude: 77.2090,
        address: `${name} (approximate location)`
      }
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to geocode location',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
