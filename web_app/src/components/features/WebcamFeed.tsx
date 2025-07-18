'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Camera, CameraOff, Play, Pause, AlertCircle } from 'lucide-react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { useVoice } from '@/contexts/VoiceContext'
import { cn } from '@/lib/utils'

interface DetectedObject {
  label: string
  confidence: number
  bbox: [number, number, number, number]
  id: string
}

interface WebcamFeedProps {
  enabled: boolean
  onDetection?: (objects: DetectedObject[]) => void
  className?: string
}

export function WebcamFeed({ enabled, onDetection, className }: WebcamFeedProps) {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { speak } = useVoice()

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
  }

  const detectObjects = useCallback(async () => {
    if (!webcamRef.current || !canvasRef.current || !enabled) return

    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    try {
      setIsDetecting(true)
      
      // Convert image to blob
      const response = await fetch(imageSrc)
      const blob = await response.blob()
      
      // Send to backend for object detection
      const formData = new FormData()
      formData.append('image', blob)
      
      const detectionResponse = await fetch('/api/detect', {
        method: 'POST',
        body: formData
      })
      
      if (!detectionResponse.ok) {
        throw new Error('Detection failed')
      }
      
      const data = await detectionResponse.json()
      const objects = data.objects || []
      
      setDetectedObjects(objects)
      onDetection?.(objects)
      
      // Draw bounding boxes on canvas
      drawBoundingBoxes(objects)
      
    } catch (error) {
      console.error('Object detection error:', error)
      setError('Failed to detect objects')
    } finally {
      setIsDetecting(false)
    }
  }, [enabled, onDetection])

  const drawBoundingBoxes = useCallback((objects: DetectedObject[]) => {
    if (!canvasRef.current || !webcamRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const video = webcamRef.current.video
    if (!video) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw bounding boxes
    objects.forEach(obj => {
      const [x, y, width, height] = obj.bbox
      
      // Draw bounding box
      ctx.strokeStyle = '#0ea5e9'
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, width, height)
      
      // Draw label background
      ctx.fillStyle = '#0ea5e9'
      ctx.fillRect(x, y - 30, width, 30)
      
      // Draw label text
      ctx.fillStyle = '#ffffff'
      ctx.font = '16px Inter'
      ctx.fillText(
        `${obj.label} (${Math.round(obj.confidence * 100)}%)`,
        x + 5,
        y - 10
      )
    })
  }, [])

  const handleUserMedia = useCallback(() => {
    setError(null)
    setIsPlaying(true)
    speak('Camera feed started')
  }, [speak])

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error('Webcam error:', error)
    setError('Failed to access camera. Please check permissions.')
    setIsPlaying(false)
    speak('Camera access failed')
  }, [speak])

  const toggleDetection = useCallback(() => {
    if (isDetecting) {
      setIsDetecting(false)
      speak('Object detection stopped')
    } else {
      detectObjects()
      speak('Object detection started')
    }
  }, [isDetecting, detectObjects, speak])

  // Auto-detect objects every 2 seconds when enabled
  useEffect(() => {
    if (!enabled || !isPlaying) return

    const interval = setInterval(() => {
      detectObjects()
    }, 2000)

    return () => clearInterval(interval)
  }, [enabled, isPlaying, detectObjects])

  // Announce detected objects
  useEffect(() => {
    if (detectedObjects.length > 0) {
      const highConfidenceObjects = detectedObjects.filter(obj => obj.confidence > 0.5)
      if (highConfidenceObjects.length > 0) {
        const announcement = highConfidenceObjects
          .map(obj => `${obj.label} detected`)
          .join(', ')
        speak(announcement)
      }
    }
  }, [detectedObjects, speak])

  if (!enabled) {
    return (
      <div className={cn(
        'flex items-center justify-center h-96 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300',
        'dark:bg-slate-800 dark:border-slate-600',
        className
      )}>
        <div className="text-center">
          <CameraOff className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
            Camera Disabled
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Enable camera to start object detection
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('webcam-container relative', className)}>
      {error && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-red-500 text-white p-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          height={720}
          width={1280}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          className="w-full h-auto rounded-2xl"
        />
        
        {/* Detection overlay canvas */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        
        {/* Webcam overlay */}
        <div className="webcam-overlay" />
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-sm">
            {isPlaying ? 'Live' : 'Paused'}
          </div>
          {isDetecting && (
            <div className="bg-primary-500/90 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-sm animate-pulse">
              Detecting...
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <LuxuryButton
            onClick={toggleDetection}
            size="sm"
            className="bg-black/50 backdrop-blur-sm hover:bg-black/70"
            disabled={!isPlaying}
          >
            {isDetecting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </LuxuryButton>
        </div>
      </div>
      
      {/* Object detection results */}
      {detectedObjects.length > 0 && (
        <div className="absolute top-4 right-4 max-w-xs">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3 text-white">
            <h4 className="font-medium mb-2">Detected Objects</h4>
            <div className="space-y-1">
              {detectedObjects.map((obj, index) => (
                <div key={index} className="text-sm">
                  {obj.label} ({Math.round(obj.confidence * 100)}%)
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
