'use client'

import { useState, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Waves, Zap, Settings, Command } from 'lucide-react'
import { LuxuryButton } from '@/components/common/ui/LuxuryButton'
import { LuxuryCard } from '@/components/common/ui/LuxuryCard'
import { useVoice } from '@/contexts/VoiceContext'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceCommandPanelProps {
  onCommand?: (command: string) => void
  className?: string
}

export function VoiceCommandPanel({ 
  onCommand, 
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

  const { isListening, isProcessing } = useVoice()

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Voice Status Card */}
      <LuxuryCard className="p-8 text-center bg-gradient-to-br from-white/10 to-white/5 border-white/20">
        <motion.div
          className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 relative ${
            isListening 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_40px_rgba(34,197,94,0.6)]' 
              : isProcessing 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-[0_0_40px_rgba(234,179,8,0.6)]' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_40px_rgba(99,102,241,0.6)]'
          }`}
          animate={{
            scale: isListening ? [1, 1.05, 1] : 1,
            rotate: isProcessing ? [0, 360] : 0
          }}
          transition={{
            duration: isListening ? 2 : isProcessing ? 1 : 0,
            repeat: (isListening || isProcessing) ? Infinity : 0,
            ease: 'easeInOut'
          }}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Waves className="w-16 h-16 text-white" />
              </motion.div>
            ) : isProcessing ? (
              <motion.div
                key="processing"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Zap className="w-16 h-16 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Mic className="w-16 h-16 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulse Ring */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
        
        <div className="space-y-3">
          <motion.h2 
            className="text-2xl font-bold text-white"
            animate={{ color: isListening ? '#10b981' : isProcessing ? '#f59e0b' : '#ffffff' }}
          >
            {isListening 
              ? 'Listening...' 
              : isProcessing 
                ? 'Processing...' 
                : 'Voice Assistant Ready'
            }
          </motion.h2>
          
          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <p className="text-white/90 font-medium mb-1">
                  "{transcript}"
                </p>
                <p className="text-white/60 text-sm">
                  Confidence: {Math.round(confidence * 100)}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LuxuryCard>

      {/* Voice Controls */}
      <LuxuryCard className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/20">
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <LuxuryButton
            onClick={handleVoiceToggle}
            disabled={!isEnabled}
            size="lg"
            className={`flex-1 sm:flex-none ${isListening 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </LuxuryButton>

          <LuxuryButton
            onClick={toggleVoice}
            size="lg"
            className={`flex-1 sm:flex-none ${isEnabled 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg shadow-gray-500/25'
            }`}
          >
            {isEnabled ? <Volume2 className="w-5 h-5 mr-2" /> : <VolumeX className="w-5 h-5 mr-2" />}
            {isEnabled ? 'Voice Enabled' : 'Voice Disabled'}
          </LuxuryButton>
        </div>
      </LuxuryCard>

      {/* Quick Commands */}
      <LuxuryCard className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/20">
        <div className="flex items-center mb-6">
          <Command className="w-6 h-6 text-white mr-3" />
          <h3 className="text-xl font-bold text-white">Quick Commands</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {testCommands.map((command, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LuxuryButton
                onClick={() => handleTestCommand(command)}
                variant="ghost"
                className="w-full justify-start text-left bg-white/5 hover:bg-white/10 border border-white/20 text-white/90 hover:text-white transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 mr-4 text-blue-400" />
                <span className="text-white">{command}</span>
              </LuxuryButton>
            </motion.div>
          ))}
        </div>
      </LuxuryCard>

      {/* Command History */}
      <AnimatePresence>
        {commandHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <LuxuryCard className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                Recent Commands
              </h3>
              <div className="space-y-3">
                {commandHistory.map((command, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <p className="text-white font-medium mb-1">{command}</p>
                    {responses[index] && (
                      <p className="text-white/60 text-sm">
                        {responses[index]}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </LuxuryCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Instructions */}
      <LuxuryCard className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <Volume2 className="w-5 h-5 mr-3" />
          Voice Commands Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🗺️', text: 'Say "Navigate to [location]" for directions' },
            { icon: '👁️', text: 'Say "What\'s in front of me?" for object detection' },
            { icon: '📷', text: 'Say "Turn on camera" to enable camera' },
            { icon: '🚨', text: 'Say "Emergency" for emergency services' },
            { icon: '📍', text: 'Say "Where am I?" for current location' }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white/10 rounded-lg">
              <span className="text-lg">{item.icon}</span>
              <span className="text-white/90 text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </LuxuryCard>
    </div>
  )
}
