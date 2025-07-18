import { useState, useEffect } from 'react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { useVoice } from '@/contexts/VoiceContext'

interface DetectedObject {
  label: string
  confidence: number
  bbox: [number, number, number, number]
  id: string
}

interface ObjectDetectionPanelProps {
  cameraEnabled: boolean
  onObjectDetected?: (object: DetectedObject) => void
}

export function ObjectDetectionPanel({ cameraEnabled, onObjectDetected }: ObjectDetectionPanelProps) {
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const { speak } = useVoice()

  useEffect(() => {
    if (!cameraEnabled || !detectedObjects.length) return

    const highConfidenceObjects = detectedObjects.filter(obj => obj.confidence > 0.5)
    if (highConfidenceObjects.length) {
      highConfidenceObjects.forEach(obj => onObjectDetected?.(obj))
    }
  }, [detectedObjects, cameraEnabled, onObjectDetected])

  const handleDetection = async () => {
    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const data = await response.json()
      if (data.objects) {
        setDetectedObjects(data.objects.map((obj: any) => ({
          ...obj,
          id: Math.random().toString(36).substr(2, 9)
        })))
        speak(`Detected: ${data.objects.map((obj: any) => obj.label).join(', ')}`)
      }
    } catch (error) {
      console.error('Error detecting objects:', error)
      speak('There was an error during object detection')
    }
  }

  return (
    <div className="space-y-4">
      <LuxuryButton onClick={handleDetection} disabled={!cameraEnabled}>
        Start Detection
      </LuxuryButton>
      <div className="space-y-2">
        {detectedObjects.map(obj => (
          <div key={obj.id} className="p-2 bg-gray-200 rounded-lg">
            <strong>{obj.label}</strong>: {Math.round(obj.confidence * 100)}%
          </div>
        ))}
      </div>
    </div>
  )
}
