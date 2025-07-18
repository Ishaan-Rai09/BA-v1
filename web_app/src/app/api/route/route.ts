import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startLat = parseFloat(searchParams.get('start_lat') || '0')
    const startLon = parseFloat(searchParams.get('start_lon') || '0')
    const endLat = parseFloat(searchParams.get('end_lat') || '0')
    const endLon = parseFloat(searchParams.get('end_lon') || '0')
    
    if (!startLat || !startLon || !endLat || !endLon) {
      return NextResponse.json({
        success: false,
        message: 'Start and end coordinates are required'
      }, { status: 400 })
    }
    
    // Mock route response for demonstration
    // In production, this would call OpenRouteService or similar
    const mockRoute = {
      features: [
        {
          type: 'Feature',
          properties: {
            segments: [
              {
                distance: 1250.5,
                duration: 900.2,
                steps: [
                  {
                    distance: 250.0,
                    duration: 180.0,
                    instruction: 'Head northeast on Main Street'
                  },
                  {
                    distance: 400.0,
                    duration: 288.0,
                    instruction: 'Turn right onto First Avenue'
                  },
                  {
                    distance: 350.0,
                    duration: 252.0,
                    instruction: 'Turn left onto Park Road'
                  },
                  {
                    distance: 250.5,
                    duration: 180.2,
                    instruction: 'Arrive at destination on the right'
                  }
                ]
              }
            ]
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [startLon, startLat],
              [startLon + 0.002, startLat + 0.001],
              [startLon + 0.004, startLat + 0.003],
              [endLon, endLat]
            ]
          }
        }
      ]
    }
    
    return NextResponse.json(mockRoute)
    
  } catch (error) {
    console.error('Route error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to get route',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
