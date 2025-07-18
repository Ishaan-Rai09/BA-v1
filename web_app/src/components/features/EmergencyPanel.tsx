import { useState } from 'react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { useVoice } from '@/contexts/VoiceContext'

interface EmergencyPanelProps {
  onEmergencyTriggered?: (type: string) => void
}

export function EmergencyPanel({ onEmergencyTriggered }: EmergencyPanelProps) {
  const [lastTriggered, setLastTriggered] = useState<string | null>(null)
  const { speak } = useVoice()

  const handleEmergencyTrigger = (type: string) => {
    setLastTriggered(type)
    speak(`Emergency triggered: ${type}`)
    onEmergencyTriggered?.(type)
  }

  return (
    <div className="space-y-4">
      <LuxuryButton 
        onClick={() => handleEmergencyTrigger('Medical Assistance')}
        variant="danger"
      >
        Medical Assistance
      </LuxuryButton>

      <LuxuryButton 
        onClick={() => handleEmergencyTrigger('Police Assistance')}
        variant="danger"
      >
        Police Assistance
      </LuxuryButton>

      <LuxuryButton 
        onClick={() => handleEmergencyTrigger('Fire Assistance')}
        variant="danger"
      >
        Fire Assistance
      </LuxuryButton>

      {lastTriggered && (
        <div className="p-2 bg-red-100 text-red-700 rounded-lg">
          Last triggered: {lastTriggered}
        </div>
      )}
    </div>
  )
}
