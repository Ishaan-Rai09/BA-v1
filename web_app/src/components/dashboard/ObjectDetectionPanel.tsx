import { useState, useEffect, useRef } from 'react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { useVoice } from '@/contexts/VoiceContext'
import { Eye, EyeOff, Camera, AlertCircle } from 'lucide-react'

interface DetectedObject {
  label: string
  confidence: number
  bbox: [number, number, number, number]
  id: string
}

interface ObjectDetectionPanelProps {
  cameraEnabled: boolean
  onObjectDetected?: (object: DetectedObject) => void
  webcamRef?: React.RefObject<HTMLVideoElement>
}

export function ObjectDetectionPanel({ 
  cameraEnabled, 
  onObjectDetected,
  webcamRef
}: ObjectDetectionPanelProps) {
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null)
  const [lastSpokenTime, setLastSpokenTime] = useState(0)
  const { speak } = useVoice()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Clean up detection interval on unmount
  useEffect(() => {
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval)
      }
    }
  }, [detectionInterval])

  // Draw bounding boxes on canvas when objects are detected
  useEffect(() => {
    if (!canvasRef.current || !webcamRef?.current || !detectedObjects.length) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set canvas dimensions to match video
    canvas.width = webcamRef.current.videoWidth
    canvas.height = webcamRef.current.videoHeight
    
    // Draw bounding boxes
    detectedObjects.forEach(obj => {
      const [x, y, width, height] = obj.bbox
      const confidence = obj.confidence
      
      // Color based on confidence (green for high, yellow for medium, red for low)
      let color = 'rgba(239, 68, 68, 0.7)' // red
      if (confidence > 0.7) {
        color = 'rgba(34, 197, 94, 0.7)' // green
      } else if (confidence > 0.5) {
        color = 'rgba(234, 179, 8, 0.7)' // yellow
      }
      
      // Draw rectangle
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, width, height)
      
      // Draw label background
      ctx.fillStyle = color
      const textWidth = ctx.measureText(obj.label).width
      ctx.fillRect(x, y - 25, textWidth + 10, 25)
      
      // Draw label text
      ctx.fillStyle = 'white'
      ctx.font = 'bold 16px Arial'
      ctx.fillText(obj.label, x + 5, y - 7)
    })
  }, [detectedObjects, webcamRef])

  // Notify about detected objects
  useEffect(() => {
    if (!cameraEnabled || !detectedObjects.length) return

    const highConfidenceObjects = detectedObjects.filter(obj => obj.confidence > 0.7)
    if (highConfidenceObjects.length) {
      // Notify parent component
      highConfidenceObjects.forEach(obj => onObjectDetected?.(obj))
      
      // Speak about objects (but not too frequently)
      const now = Date.now()
      if (now - lastSpokenTime > 3000) { // Only speak every 3 seconds
        const uniqueLabels = [...new Set(highConfidenceObjects.map(obj => obj.label))]
        if (uniqueLabels.length > 0) {
          speak(`Detected: ${uniqueLabels.join(', ')}`)
          setLastSpokenTime(now)
        }
      }
    }
  }, [detectedObjects, cameraEnabled, onObjectDetected, speak, lastSpokenTime])

  const handleDetection = async () => {
    if (!cameraEnabled || !webcamRef?.current) {
      speak('Camera is not enabled')
      return
    }
    
    try {
      // Get image data from webcam
      const video = webcamRef.current
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = canvas.toDataURL('image/jpeg')
      
      // Send to API
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_data: imageData.split(',')[1] // Remove data URL prefix
        })
      })
      
      const data = await response.json()
      if (data.objects) {
        setDetectedObjects(data.objects.map((obj: any) => ({
          ...obj,
          id: Math.random().toString(36).substr(2, 9)
        })))
      }
    } catch (error) {
      console.error('Error detecting objects:', error)
      speak('There was an error during object detection')
    }
  }

  const toggleContinuousDetection = () => {
    if (isDetecting) {
      // Stop detection
      if (detectionInterval) {
        clearInterval(detectionInterval)
        setDetectionInterval(null)
      }
      setIsDetecting(false)
      speak('Object detection stopped')
    } else {
      // Start continuous detection
      setIsDetecting(true)
      speak('Starting continuous object detection')
      
      // Run detection immediately
      handleDetection()
      
      // Set up interval for continuous detection
      const interval = setInterval(handleDetection, 1000)
      setDetectionInterval(interval)
    }
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Object Detection</h3>
        <div className="flex gap-2">
          <LuxuryButton 
            onClick={handleDetection} 
            disabled={!cameraEnabled || isDetecting}
            size="sm"
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Camera className="w-4 h-4 mr-2" />
            Detect Once
          </LuxuryButton>
          
          <LuxuryButton 
            onClick={toggleContinuousDetection} 
            disabled={!cameraEnabled}
            size="sm"
            variant={isDetecting ? "destructive" : "default"}
            className={isDetecting ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isDetecting ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Stop Detection
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Start Continuous
              </>
            )}
          </LuxuryButton>
        </div>
      </div>
      
      {/* Canvas overlay for drawing bounding boxes */}
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
        />
      </div>
      
      {/* Detection results */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Detected Objects</h4>
        {detectedObjects.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {detectedObjects.map(obj => (
              <div 
                key={obj.id} 
                className="p-3 rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: obj.confidence > 0.7 
                    ? 'rgba(34, 197, 94, 0.2)' 
                    : obj.confidence > 0.5 
                      ? 'rgba(234, 179, 8, 0.2)' 
                      : 'rgba(239, 68, 68, 0.2)',
                  borderLeft: `4px solid ${
                    obj.confidence > 0.7 
                      ? 'rgb(34, 197, 94)' 
                      : obj.confidence > 0.5 
                        ? 'rgb(234, 179, 8)' 
                        : 'rgb(239, 68, 68)'
                  }`
                }}
              >
                <div className="flex-1">
                  <div className="font-bold">{obj.label}</div>
                  <div className="text-sm text-gray-600">
                    Confidence: {Math.round(obj.confidence * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            No objects detected yet
          </div>
        )}
      </div>
      
      {isDetecting && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <div className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Detection
          </div>
        </div>
      )}
    </div>
  )
}
