import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      api: 'online',
      database: 'online',
      voice: 'online',
      camera: 'online'
    }
  })
}
