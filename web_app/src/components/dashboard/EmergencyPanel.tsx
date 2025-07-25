import { useState } from 'react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { useVoice } from '@/contexts/VoiceContext'

interface EmergencyPanelProps {
  onEmergencyTriggered?: (type: string) => void
}

export function EmergencyPanel({ onEmergencyTriggered }: EmergencyPanelProps) {
  const [lastTriggered, setLastTriggered] = useState<string | null>(null)
  const [isTriggering, setIsTriggering] = useState(false)
  const { speak } = useVoice()

  const handleEmergencyTrigger = async (type: string) => {
    setIsTriggering(true)
    setLastTriggered(type)
    speak(`Emergency triggered: ${type}`)
    onEmergencyTriggered?.(type)
    
    // Simulate emergency processing
    setTimeout(() => {
      setIsTriggering(false)
    }, 2000)
  }

  const emergencyTypes = [
    {
      type: 'Medical Assistance',
      icon: '🚑',
      description: 'Call emergency medical services'
    },
    {
      type: 'Police Assistance', 
      icon: '👮',
      description: 'Contact police emergency services'
    },
    {
      type: 'Fire Assistance',
      icon: '🚒', 
      description: 'Alert fire department services'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-xl border border-blue-200 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
          🚨 Emergency Services
        </h2>
        <p className="text-blue-700 text-sm">
          Tap any button below to trigger emergency assistance
        </p>
      </div>

      <div className="space-y-4">
        {emergencyTypes.map((emergency) => (
          <div key={emergency.type} className="group">
            <button
              onClick={() => handleEmergencyTrigger(emergency.type)}
              disabled={isTriggering}
              className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-red-300 shadow-lg hover:shadow-xl"
              aria-label={`Emergency: ${emergency.type} - ${emergency.description}`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl" role="img" aria-hidden="true">
                  {emergency.icon}
                </span>
                <div className="text-left">
                  <div className="font-semibold text-lg">
                    {emergency.type}
                  </div>
                  <div className="text-red-100 text-sm">
                    {emergency.description}
                  </div>
                </div>
              </div>
              
              {isTriggering && (
                <div className="mt-2 flex justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {lastTriggered && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-500 rounded-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 font-semibold">⚠️ Alert Status:</span>
            <span className="text-yellow-800">Last triggered - {lastTriggered}</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Emergency services have been notified
          </p>
        </div>
      )}

      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm text-center">
          <span className="font-semibold">Important:</span> These buttons will contact real emergency services. Use only in genuine emergencies.
        </p>
      </div>
    </div>
  )
}
