import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Mock object detection response for demonstration
    // In production, this would process the image with YOLO or similar
    const mockObjects = [
      {
        label: 'person',
        confidence: 0.92,
        bbox: [100, 150, 200, 400],
        id: 'person_1'
      },
      {
        label: 'chair',
        confidence: 0.78,
        bbox: [300, 250, 150, 200],
        id: 'chair_1'
      },
      {
        label: 'table',
        confidence: 0.85,
        bbox: [450, 200, 180, 120],
        id: 'table_1'
      }
    ]
    
    // Filter objects with high confidence
    const filteredObjects = mockObjects.filter(obj => obj.confidence > 0.5)
    
    return NextResponse.json({
      success: true,
      objects: filteredObjects,
      timestamp: new Date().toISOString(),
      processing_time: '0.25s'
    })
    
  } catch (error) {
    console.error('Object detection error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to detect objects',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
