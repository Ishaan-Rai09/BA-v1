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
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
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

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1]
        const lastTranscript = lastResult[0].transcript
        const lastConfidence = lastResult[0].confidence

        setTranscript(lastTranscript)
        setConfidence(lastConfidence)
        setIsProcessing(false)

        if (lastResult.isFinal) {
          // Send to backend for processing
          processCommand(lastTranscript)
        }
      }

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setIsProcessing(false)
        
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable microphone permissions.')
        } else if (event.error === 'network') {
          toast.error('Network error. Please check your internet connection.')
        } else {
          toast.error('Speech recognition error. Please try again.')
        }
      }

      setRecognition(recognitionInstance)
    }

    // Initialize Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synthInstance = window.speechSynthesis
      setSynthesis(synthInstance)

      const loadVoices = () => {
        const availableVoices = synthInstance.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()
      synthInstance.onvoiceschanged = loadVoices
    }
  }, [language])

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
          await speak(data.response)
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

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!isEnabled || !synthesis) {
      return
    }

    // Cancel any ongoing speech
    synthesis.cancel()

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Find the best voice for the current language
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(language.split('-')[0]) && voice.localService
      ) || voices.find(voice => 
        voice.lang.startsWith(language.split('-')[0])
      ) || voices[0]

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onend = () => resolve()
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
        reject(new Error(event.error))
      }

      synthesis.speak(utterance)
    })
  }, [isEnabled, synthesis, voices, language])

  const toggleVoice = useCallback(() => {
    setIsEnabled(!isEnabled)
    if (isListening) {
      stopListening()
    }
    if (synthesis) {
      synthesis.cancel()
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
