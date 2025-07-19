'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Eye, EyeOff, AlertTriangle, Check, RefreshCw, Volume2 } from 'lucide-react'
import { useVoice } from '@/contexts/VoiceContext'
import { LuxuryButton } from '@/components/common/ui/LuxuryButton'

interface DetectedObject {
  label: string
  confidence: number
  bbox: [number, number, number, number]
  id: string
}

interface ObjectDetectionPanelProps {
  cameraEnabled: boolean
  webcamRef: HTMLVideoElement | null
  onObjectDetected?: (object: DetectedObject) => void
}

export function ObjectDetectionPanel({ 
  cameraEnabled, 
  webcamRef, 
  onObjectDetected 
}: ObjectDetectionPanelProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionInterval, setDetectionInterval] = useState<number>(1000)
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastDetectionTime, setLastDetectionTime] = useState<Date | null>(null)
  const [announceObjects, setAnnounceObjects] = useState(true)
  const { speak } = useVoice()
  
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [])
  
  // Reset detection when camera is disabled
  useEffect(() => {
    if (!cameraEnabled && isDetecting) {
      stopDetection()
    }
  }, [cameraEnabled])

  // Function to capture image from webcam
  const captureImage = useCallback(() => {
    if (!webcamRef) {
      console.error('No webcam reference available')
      return null
    }
    
    try {
      const video = webcamRef
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        console.error('Could not get canvas context')
        return null
      }
      
      // Draw the current video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert to base64
      return canvas.toDataURL('image/jpeg')
    } catch (err) {
      console.error('Error capturing image:', err)
      return null
    }
  }, [webcamRef])
  
  // Draw bounding boxes on canvas
  const drawDetections = useCallback((objects: DetectedObject[]) => {
    if (!canvasRef.current || !webcamRef) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions to match video
    canvas.width = webcamRef.videoWidth
    canvas.height = webcamRef.videoHeight
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw each detection
    objects.forEach(obj => {
      const [x, y, width, height] = obj.bbox
      const label = `${obj.label} ${Math.round(obj.confidence * 100)}%`
      
      // Draw rectangle
      ctx.strokeStyle = '#10B981' // Green color
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, width, height)
      
      // Draw background for text
      ctx.fillStyle = '#10B981'
      const textWidth = ctx.measureText(label).width
      ctx.fillRect(x, y - 25, textWidth + 10, 25)
      
      // Draw text
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '16px Arial'
      ctx.fillText(label, x + 5, y - 8)
    })
  }, [webcamRef])
  
  // Perform object detection
  const detectObjects = useCallback(async () => {
    if (!cameraEnabled || !webcamRef || isLoading) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Capture image from webcam
      const imageData = captureImage()
      if (!imageData) {
        setError('Failed to capture image from webcam')
        return
      }
      
      // Send to API for detection
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
      })
      
      if (!response.ok) {
        throw new Error(`Detection failed: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.objects && Array.isArray(result.objects)) {
        // Update state with detected objects
        setDetectedObjects(result.objects)
        
        // Draw bounding boxes
        drawDetections(result.objects)
        
        // Set last detection time
        const now = new Date()
        setLastDetectionTime(now)
        
        // Announce objects if enabled
        if (announceObjects && result.objects.length > 0) {
          const objectNames = result.objects
            .slice(0, 3) // Limit to top 3 objects
            .map((obj: DetectedObject) => obj.label)
            .join(', ')
          
          if (objectNames) {
            speak(`Detected: ${objectNames}`)
          }
        }
        
        // Call the callback for each detected object
        if (onObjectDetected) {
          result.objects.forEach((obj: DetectedObject) => {
            onObjectDetected(obj)
          })
        }
      }
    } catch (err) {
      console.error('Detection error:', err)
      setError(err instanceof Error ? err.message : 'Unknown detection error')
    } finally {
      setIsLoading(false)
    }
  }, [cameraEnabled, webcamRef, isLoading, captureImage, drawDetections, announceObjects, speak, onObjectDetected])
  
  // Start continuous detection
  const startDetection = useCallback(() => {
    if (!cameraEnabled) {
      speak('Please enable the camera first')
      return
    }
    
    if (!webcamRef) {
      speak('Camera not ready')
      return
    }
    
    setIsDetecting(true)
    speak('Starting object detection')
    
    // Perform initial detection
    detectObjects()
    
    // Set up interval for continuous detection
    detectionIntervalRef.current = setInterval(() => {
      detectObjects()
    }, detectionInterval)
  }, [cameraEnabled, webcamRef, detectObjects, detectionInterval, speak])
  
  // Stop detection
  const stopDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    
    setIsDetecting(false)
    speak('Object detection stopped')
  }, [speak])
  
  // Toggle detection
  const toggleDetection = useCallback(() => {
    if (isDetecting) {
      stopDetection()
    } else {
      startDetection()
    }
  }, [isDetecting, startDetection, stopDetection])
  
  // Handle detection interval change
  const handleIntervalChange = (value: number) => {
    setDetectionInterval(value)
    
    // Restart detection if it's already running
    if (isDetecting) {
      stopDetection()
      setTimeout(() => {
        startDetection()
      }, 100)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Object Detection</h3>
        
        <div className="flex items-center space-x-2">
          <LuxuryButton
            onClick={toggleDetection}
            size="sm"
            disabled={!cameraEnabled || !webcamRef}
            className={isDetecting ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'}
          >
            {isDetecting ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" /> Stop
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" /> Start
              </>
            )}
          </LuxuryButton>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Detection Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {/* Detection settings */}
      <div className="bg-slate-50 rounded-xl p-4 space-y-4">
        <h4 className="font-medium">Detection Settings</h4>
        
        <div>
          <label className="text-sm text-slate-600 block mb-1">
            Detection Interval: {detectionInterval}ms
          </label>
          <input 
            type="range" 
            min="500" 
            max="5000" 
            step="500" 
            value={detectionInterval}
            onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="announce-objects" 
            checked={announceObjects}
            onChange={() => setAnnounceObjects(!announceObjects)}
            className="rounded text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="announce-objects" className="text-sm text-slate-700 flex items-center">
            <Volume2 className="w-4 h-4 mr-1" />
            Announce detected objects
          </label>
        </div>
      </div>
      
      {/* Detection results */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Detected Objects</h4>
          
          {lastDetectionTime && (
            <p className="text-xs text-slate-500">
              Last updated: {lastDetectionTime.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        {/* Canvas overlay for bounding boxes */}
        <div className="relative mb-4">
          <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-auto"
          />
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
            <span className="ml-2 text-slate-600">Processing...</span>
          </div>
        ) : detectedObjects.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {detectedObjects.map((obj, index) => (
              <div 
                key={`${obj.label}-${index}`}
                className="bg-white rounded-lg border border-slate-200 p-3 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium">{obj.label}</span>
                </div>
                <span className="text-sm bg-primary-50 text-primary-700 px-2 py-1 rounded">
                  {Math.round(obj.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-6 text-center">
            <p className="text-slate-500">
              {cameraEnabled ? 'No objects detected yet' : 'Enable camera to detect objects'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
