'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { toast } from 'react-hot-toast'

interface VoiceContextType {
  isListening: boolean
  isProcessing: boolean
  isEnabled: boolean
  transcript: string
  confidence: number
  startListening: () => void
  stopListening: () => void
  speak: (text: string) => Promise<void>
  toggleVoice: () => void
  setLanguage: (lang: string) => void
  language: string
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

interface VoiceProviderProps {
  children: ReactNode
}

export function VoiceProvider({ children }: VoiceProviderProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [language, setLanguage] = useState('en-US')
  const [recognition, setRecognition] = useState<any>(null)
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechQueue, setSpeechQueue] = useState<string[]>([])

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = language
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onstart = () => {
        setIsListening(true)
        setIsProcessing(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
        setIsProcessing(false)
      }

      recognitionInstance.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1]
        const lastTranscript = lastResult[0].transcript
        const lastConfidence = lastResult[0].confidence

        setTranscript(lastTranscript)
        setConfidence(lastConfidence)
        setIsProcessing(false)

        if (lastResult.isFinal) {
          processCommand(lastTranscript)
        }
      }

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setIsProcessing(false)
        
        toast.error('Speech recognition error. Please try again.')
      }

      setRecognition(recognitionInstance)
    }

    // Initialize Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synthInstance = window.speechSynthesis
      setSynthesis(synthInstance)

      // Load voices
      const loadVoices = () => {
        const availableVoices = synthInstance.getVoices()
        if (availableVoices.length > 0) {
          setVoices(availableVoices)
        }
      }

      // Try to load voices immediately
      loadVoices()
      
      // Also set up the event listener for when voices change/load
      synthInstance.onvoiceschanged = loadVoices
      
      // Fix for Chrome bug where speech synthesis gets stuck
      const resetInterval = setInterval(() => {
        if (synthInstance.speaking) {
          synthInstance.cancel()
          setIsSpeaking(false)
        }
      }, 15000)

      return () => {
        clearInterval(resetInterval)
        synthInstance.cancel()
      }
    }
  }, [language])

  // Process speech queue
  useEffect(() => {
    if (speechQueue.length > 0 && !isSpeaking && synthesis) {
      const text = speechQueue[0]
      setSpeechQueue(prev => prev.slice(1))
      
      setIsSpeaking(true)
      
      try {
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Find appropriate voice
        if (voices.length > 0) {
          const preferredVoice = voices.find(voice => 
            voice.lang.startsWith(language.split('-')[0])
          ) || voices[0]
          
          utterance.voice = preferredVoice
        }
        
        // Configure utterance
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0
        
        // Handle events
        utterance.onend = () => {
          setIsSpeaking(false)
        }
        
        utterance.onerror = () => {
          console.error('Speech synthesis error')
          setIsSpeaking(false)
          toast(text, { duration: 5000 })
        }
        
        // Cancel any ongoing speech
        synthesis.cancel()
        
        // Speak with timeout to prevent Chrome bug
        setTimeout(() => {
          synthesis.speak(utterance)
        }, 50)
      } catch (error) {
        console.error('Error in speech synthesis:', error)
        setIsSpeaking(false)
        toast(text, { duration: 5000 })
      }
    }
  }, [speechQueue, isSpeaking, synthesis, voices, language])

  const processCommand = async (command: string) => {
    try {
      setIsProcessing(true)
      
      // Send command to backend for processing
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command, language }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Handle successful command processing
        if (data.response) {
          speak(data.response)
        }
        
        if (data.action) {
          // Trigger appropriate action
          window.dispatchEvent(new CustomEvent('voiceCommand', { detail: data.action }))
        }
      } else {
        toast.error(data.message || 'Failed to process voice command')
      }
    } catch (error) {
      console.error('Error processing voice command:', error)
      toast.error('Failed to process voice command')
    } finally {
      setIsProcessing(false)
    }
  }

  const startListening = useCallback(() => {
    if (!isEnabled) {
      toast.error('Voice recognition is disabled')
      return
    }

    if (!recognition) {
      toast.error('Speech recognition not supported')
      return
    }

    try {
      recognition.start()
      setIsProcessing(true)
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      toast.error('Failed to start voice recognition')
    }
  }, [isEnabled, recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
    }
  }, [recognition])

  const speak = useCallback((text: string): Promise<void> => {
    if (!text || !isEnabled) {
      return Promise.resolve()
    }
    
    // Add to queue
    setSpeechQueue(prev => [...prev, text])
    return Promise.resolve()
  }, [isEnabled])

  const toggleVoice = useCallback(() => {
    setIsEnabled(!isEnabled)
    if (isListening) {
      stopListening()
    }
    if (synthesis) {
      synthesis.cancel()
      setIsSpeaking(false)
      setSpeechQueue([])
    }
  }, [isEnabled, isListening, stopListening, synthesis])

  const setLanguageCallback = useCallback((lang: string) => {
    setLanguage(lang)
    if (recognition) {
      recognition.lang = lang
    }
  }, [recognition])

  const value: VoiceContextType = {
    isListening,
    isProcessing,
    isEnabled,
    transcript,
    confidence,
    startListening,
    stopListening,
    speak,
    toggleVoice,
    setLanguage: setLanguageCallback,
    language,
  }

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider')
  }
  return context
}
