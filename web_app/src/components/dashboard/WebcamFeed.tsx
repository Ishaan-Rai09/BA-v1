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
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { speak } = useVoice()

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  }

  // Store reference to the video element
  useEffect(() => {
    if (webcamRef.current && webcamRef.current.video) {
      videoRef.current = webcamRef.current.video;
    }
  }, [isPlaying]);

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

  // Expose the video element reference for the ObjectDetectionPanel
  const getVideoRef = () => {
    return videoRef.current;
  }

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
      
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
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
        
        {/* Webcam overlay - adds a subtle luxury effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/10 via-transparent to-primary-900/10"></div>
        
        {/* Status indicator */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-sm flex items-center">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'} mr-2`}></div>
            {isPlaying ? 'Camera Active' : 'Camera Inactive'}
          </div>
        </div>
      </div>
      
      {/* Export video ref for object detection */}
      {isPlaying && (
        <input type="hidden" id="webcam-active" value="true" />
      )}
    </div>
  )
}
