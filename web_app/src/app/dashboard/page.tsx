'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Navigation, 
  MapPin, 
  AlertTriangle,
  Eye,
  EyeOff,
  Settings,
  User,
  Volume2,
  VolumeX,
  Menu,
  X,
  ChevronRight,
  Home,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { WebcamFeed } from '@/components/dashboard/WebcamFeed'
import { VoiceCommandPanel } from '@/components/dashboard/VoiceCommandPanel'
import { NavigationPanel } from '@/components/dashboard/NavigationPanel'
import { ObjectDetectionPanel } from '@/components/dashboard/ObjectDetectionPanel'
import { EmergencyPanel } from '@/components/dashboard/EmergencyPanel'
import { useVoice } from '@/contexts/VoiceContext'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { LuxuryButton } from '@/components/common/ui/LuxuryButton'
import { LuxuryCard } from '@/components/common/ui/LuxuryCard'
import { StatusIndicator } from '@/components/common/ui/StatusIndicator'

// Define the status type to match StatusIndicator component
type StatusType = 'online' | 'offline' | 'processing' | 'warning' | 'standby';

interface DetectedObject {
  label: string
  confidence: number
  bbox: [number, number, number, number]
  id: string
}

export default function Dashboard() {
  // Mock user for demo
  const user = { firstName: 'Demo', lastName: 'User', email: 'demo@example.com' }
  
  const { 
    isListening, 
    isProcessing, 
    startListening, 
    stopListening, 
    speak,
    isEnabled: voiceEnabled,
    toggleVoice 
  } = useVoice()
  
  const { 
    highContrast, 
    toggleHighContrast,
    announceScreenReader 
  } = useAccessibility()

  const [activePanel, setActivePanel] = useState<'webcam' | 'voice' | 'navigation' | 'detection' | 'emergency'>('webcam')
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    camera: 'offline' as StatusType,
    microphone: 'offline' as StatusType,
    location: 'offline' as StatusType,
    ai: 'offline' as StatusType
  })
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Update', message: 'New features available', time: '2 hours ago', read: false },
    { id: 2, title: 'Location Services', message: 'GPS signal improved', time: '1 day ago', read: true }
  ])
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Check system capabilities
    checkSystemCapabilities()
    
    // Announce dashboard loaded
    setTimeout(() => {
      announceScreenReader('Dashboard loaded successfully. Welcome to Blind Assistant.')
      speak('Welcome to your luxury assistive technology dashboard.')
    }, 1000)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const checkSystemCapabilities = async () => {
    // Check camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      setSystemStatus(prev => ({ ...prev, camera: 'online' as StatusType }))
    } catch {
      setSystemStatus(prev => ({ ...prev, camera: 'offline' as StatusType }))
    }

    // Check microphone
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setSystemStatus(prev => ({ ...prev, microphone: 'online' as StatusType }))
    } catch {
      setSystemStatus(prev => ({ ...prev, microphone: 'offline' as StatusType }))
    }

    // Check location
    if (navigator.geolocation) {
      setSystemStatus(prev => ({ ...prev, location: 'online' as StatusType }))
    }

    // Check AI backend
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        setSystemStatus(prev => ({ ...prev, ai: 'online' as StatusType }))
      }
    } catch {
      setSystemStatus(prev => ({ ...prev, ai: 'offline' as StatusType }))
    }
  }

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()
    
    if (lowerCommand.includes('camera') || lowerCommand.includes('webcam')) {
      setActivePanel('webcam')
      setCameraEnabled(true)
      speak('Camera activated')
    } else if (lowerCommand.includes('navigate') || lowerCommand.includes('directions')) {
      setActivePanel('navigation')
      speak('Navigation panel opened')
    } else if (lowerCommand.includes('detect') || lowerCommand.includes('objects')) {
      setActivePanel('detection')
      setCameraEnabled(true)
      speak('Object detection panel opened')
    } else if (lowerCommand.includes('emergency') || lowerCommand.includes('help')) {
      setActivePanel('emergency')
      speak('Emergency panel activated')
    } else if (lowerCommand.includes('voice') || lowerCommand.includes('commands')) {
      setActivePanel('voice')
      speak('Voice command panel opened')
    } else if (lowerCommand.includes('turn on camera')) {
      setCameraEnabled(true)
      speak('Camera turned on')
    } else if (lowerCommand.includes('turn off camera')) {
      setCameraEnabled(false)
      speak('Camera turned off')
    }
  }

  const handleObjectDetected = (object: DetectedObject) => {
    setDetectedObjects(prev => {
      // Check if object already exists
      const exists = prev.some(obj => obj.id === object.id)
      if (exists) return prev
      
      // Add new object and limit to 10 most recent
      const updated = [object, ...prev].slice(0, 10)
      return updated
    })
  }

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <div className={`min-h-screen bg-slate-50 ${highContrast ? 'high-contrast' : ''}`}>
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 shadow-sm fixed top-0 left-0 right-0 z-30 h-16">
        <div className="h-full flex items-center justify-between px-4">
          {/* Logo and Menu Toggle */}
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-slate-100 mr-3"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center">
              <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-primary-600 to-luxury-royal bg-clip-text text-transparent">
                Blind Assistant
              </h1>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {/* System Status Indicators */}
            <div className="hidden md:flex items-center space-x-2 mr-4">
              <StatusIndicator 
                status={systemStatus.camera} 
                label="Camera"
                icon={Camera}
              />
              <StatusIndicator 
                status={systemStatus.microphone} 
                label="Microphone"
                icon={Mic}
              />
              <StatusIndicator 
                status={systemStatus.location} 
                label="Location"
                icon={MapPin}
              />
              <StatusIndicator 
                status={systemStatus.ai} 
                label="AI"
                icon={Eye}
              />
            </div>
            
            {/* Voice Command Button */}
            <LuxuryButton
              onClick={() => {
                if (isListening) {
                  stopListening()
                } else {
                  startListening()
                }
              }}
              size="sm"
              className={`relative ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'}`}
              disabled={systemStatus.microphone === 'offline'}
              aria-label={isListening ? 'Stop voice command' : 'Start voice command'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-1" /> Stop
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-1" /> Voice
                </>
              )}
            </LuxuryButton>
            
            {/* Camera Toggle Button */}
            <LuxuryButton
              onClick={() => setCameraEnabled(!cameraEnabled)}
              size="sm"
              className={`relative ${cameraEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-600 hover:bg-slate-700'}`}
              disabled={systemStatus.camera === 'offline'}
              aria-label={cameraEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {cameraEnabled ? (
                <>
                  <Camera className="w-4 h-4 mr-1" /> On
                </>
              ) : (
                <>
                  <CameraOff className="w-4 h-4 mr-1" /> Off
                </>
              )}
            </LuxuryButton>
            
            {/* User Menu */}
            <div className="relative ml-2">
              <button 
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                  {user.firstName[0]}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Layout */}
      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-r border-slate-200 h-full fixed left-0 top-16 z-20 overflow-y-auto"
            >
              <div className="p-4">
                <nav className="space-y-1">
                  <button
                    onClick={() => {
                      setActivePanel('webcam')
                      speak('Camera view activated')
                    }}
                    className={`flex items-center w-full p-3 rounded-lg ${
                      activePanel === 'webcam' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <Camera className="w-5 h-5 mr-3" />
                    <span>Camera Feed</span>
                    {activePanel === 'webcam' && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setActivePanel('detection')
                      speak('Object detection activated')
                    }}
                    className={`flex items-center w-full p-3 rounded-lg ${
                      activePanel === 'detection' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <Eye className="w-5 h-5 mr-3" />
                    <span>Object Detection</span>
                    {activePanel === 'detection' && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setActivePanel('navigation')
                      speak('Navigation activated')
                    }}
                    className={`flex items-center w-full p-3 rounded-lg ${
                      activePanel === 'navigation' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <Navigation className="w-5 h-5 mr-3" />
                    <span>Navigation</span>
                    {activePanel === 'navigation' && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setActivePanel('voice')
                      speak('Voice commands activated')
                    }}
                    className={`flex items-center w-full p-3 rounded-lg ${
                      activePanel === 'voice' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <Mic className="w-5 h-5 mr-3" />
                    <span>Voice Commands</span>
                    {activePanel === 'voice' && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setActivePanel('emergency')
                      speak('Emergency panel activated')
                    }}
                    className={`flex items-center w-full p-3 rounded-lg ${
                      activePanel === 'emergency' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <span>Emergency</span>
                    {activePanel === 'emergency' && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                </nav>
                
                <div className="mt-8 pt-4 border-t border-slate-200">
                  <h3 className="text-xs uppercase text-slate-500 font-medium mb-2 px-3">Settings</h3>
                  <div className="space-y-1">
                    <button
                      onClick={toggleHighContrast}
                      className="flex items-center w-full p-3 rounded-lg hover:bg-slate-50"
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      <span>High Contrast: {highContrast ? 'On' : 'Off'}</span>
                    </button>
                    
                    <button
                      onClick={toggleVoice}
                      className="flex items-center w-full p-3 rounded-lg hover:bg-slate-50"
                    >
                      {voiceEnabled ? (
                        <Volume2 className="w-5 h-5 mr-3" />
                      ) : (
                        <VolumeX className="w-5 h-5 mr-3" />
                      )}
                      <span>Voice Feedback: {voiceEnabled ? 'On' : 'Off'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main 
          className={`flex-1 p-4 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'md:ml-60' : ''
          }`}
        >
          {/* Panel Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {activePanel === 'webcam' && 'Camera Feed'}
              {activePanel === 'detection' && 'Object Detection'}
              {activePanel === 'navigation' && 'Navigation'}
              {activePanel === 'voice' && 'Voice Commands'}
              {activePanel === 'emergency' && 'Emergency Services'}
            </h1>
            <p className="text-slate-500">
              {activePanel === 'webcam' && 'View your surroundings through the camera'}
              {activePanel === 'detection' && 'Identify objects in your environment'}
              {activePanel === 'navigation' && 'Get directions and location information'}
              {activePanel === 'voice' && 'Control the app with your voice'}
              {activePanel === 'emergency' && 'Quick access to emergency services'}
            </p>
          </div>
          
          {/* Panel Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Always show webcam feed if camera is enabled */}
            <div className={`${activePanel === 'detection' ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePanel}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="h-full"
                >
                  {/* Webcam Feed Panel */}
                  {activePanel === 'webcam' && (
                    <LuxuryCard className="p-6 h-full">
                      <WebcamFeed 
                        enabled={cameraEnabled} 
                        onDetection={(objects) => objects.forEach(handleObjectDetected)}
                      />
                    </LuxuryCard>
                  )}
                  
                  {/* Object Detection Panel */}
                  {activePanel === 'detection' && (
                    <div className="grid grid-cols-1 gap-6 h-full">
                      <LuxuryCard className="p-6">
                        <WebcamFeed 
                          enabled={cameraEnabled} 
                          onDetection={(objects) => objects.forEach(handleObjectDetected)}
                        />
                      </LuxuryCard>
                    </div>
                  )}
                  
                  {/* Navigation Panel */}
                  {activePanel === 'navigation' && (
                    <LuxuryCard className="p-6 h-full">
                      <NavigationPanel />
                    </LuxuryCard>
                  )}
                  
                  {/* Voice Command Panel */}
                  {activePanel === 'voice' && (
                    <LuxuryCard className="p-6 h-full">
                      <VoiceCommandPanel onCommand={handleVoiceCommand} />
                    </LuxuryCard>
                  )}
                  
                  {/* Emergency Panel */}
                  {activePanel === 'emergency' && (
                    <LuxuryCard className="p-6 h-full">
                      <EmergencyPanel />
                    </LuxuryCard>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Right Column - Show object detection controls when in detection mode */}
            {activePanel === 'detection' && (
              <div className="lg:col-span-4">
                <LuxuryCard className="p-6 h-full">
                  <ObjectDetectionPanel 
                    cameraEnabled={cameraEnabled}
                    onObjectDetected={handleObjectDetected}
                    webcamRef={webcamVideoRef}
                  />
                </LuxuryCard>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 