'use client'

import { useState, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { useVoice } from '@/contexts/VoiceContext'
import { motion } from 'framer-motion'

interface VoiceCommandPanelProps {
  onCommand?: (command: string) => void
  isListening: boolean
  isProcessing: boolean
  className?: string
}

export function VoiceCommandPanel({ 
  onCommand, 
  isListening, 
  isProcessing,
  className 
}: VoiceCommandPanelProps) {
  const { 
    transcript, 
    confidence, 
    startListening, 
    stopListening, 
    speak,
    isEnabled,
    toggleVoice 
  } = useVoice()
  
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [responses, setResponses] = useState<string[]>([])

  useEffect(() => {
    if (transcript && confidence > 0.7) {
      setCommandHistory(prev => [...prev.slice(-4), transcript])
      onCommand?.(transcript)
    }
  }, [transcript, confidence, onCommand])

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const testCommands = [
    'Navigate to the park',
    'What\'s in front of me?',
    'Turn on the camera',
    'Where am I?',
    'Emergency help'
  ]

  const handleTestCommand = async (command: string) => {
    await speak(`Testing command: ${command}`)
    onCommand?.(command)
    setCommandHistory(prev => [...prev.slice(-4), command])
    setResponses(prev => [...prev.slice(-4), `Executed: ${command}`])
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Voice Status */}
      <div className="text-center">
        <motion.div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
            isListening 
              ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]' 
              : isProcessing 
                ? 'bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]' 
                : 'bg-primary-500 shadow-[0_0_30px_rgba(14,165,233,0.5)]'
          }`}
          animate={{
            scale: isListening ? [1, 1.1, 1] : 1,
            opacity: isProcessing ? [1, 0.7, 1] : 1
          }}
          transition={{
            duration: 1,
            repeat: isListening || isProcessing ? Infinity : 0,
            ease: 'easeInOut'
          }}
        >
          {isListening ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </motion.div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isListening 
              ? 'Listening...' 
              : isProcessing 
                ? 'Processing...' 
                : 'Ready to listen'
            }
          </p>
          {transcript && (
            <p className="text-sm text-muted-foreground">
              "{transcript}" ({Math.round(confidence * 100)}% confidence)
            </p>
          )}
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex justify-center space-x-4">
        <LuxuryButton
          onClick={handleVoiceToggle}
          disabled={!isEnabled}
          className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {isListening ? 'Stop' : 'Start'}
        </LuxuryButton>

        <LuxuryButton
          onClick={toggleVoice}
          variant={isEnabled ? 'primary' : 'secondary'}
        >
          {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          {isEnabled ? 'Voice On' : 'Voice Off'}
        </LuxuryButton>
      </div>

      {/* Quick Commands */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Quick Commands</h3>
        <div className="grid grid-cols-1 gap-2">
          {testCommands.map((command, index) => (
            <LuxuryButton
              key={index}
              onClick={() => handleTestCommand(command)}
              variant="ghost"
              className="justify-start text-left"
            >
              <MessageCircle className="w-4 h-4 mr-3" />
              {command}
            </LuxuryButton>
          ))}
        </div>
      </div>

      {/* Command History */}
      {commandHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Commands</h3>
          <div className="space-y-2">
            {commandHistory.map((command, index) => (
              <div
                key={index}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                <p className="text-sm font-medium">{command}</p>
                {responses[index] && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {responses[index]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
        <h4 className="font-semibold mb-2">Voice Commands</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Say "Navigate to [location]" for directions</li>
          <li>• Say "What's in front of me?" for object detection</li>
          <li>• Say "Turn on camera" to enable camera</li>
          <li>• Say "Emergency" for emergency services</li>
          <li>• Say "Where am I?" for current location</li>
        </ul>
      </div>
    </div>
  )
}
