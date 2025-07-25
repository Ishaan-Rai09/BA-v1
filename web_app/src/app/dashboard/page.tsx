'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUser, SignOutButton } from '@clerk/nextjs'
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
  LogOut,
  Sparkles,
  Zap,
  Brain,
  Headphones,
  Compass,
  Shield,
  Star,
  Activity,
  Waves
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
  const router = useRouter()
  const { user, isLoaded } = useUser()
  
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
  
  // Create a ref for the webcam video element
  const webcamRef = useRef<HTMLVideoElement | null>(null)
  // Create a ref for the WebcamFeed component
  const webcamFeedRef = useRef<any>(null)

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

  // Function to get webcam video element from WebcamFeed component
  const setWebcamVideoRef = (videoElement: HTMLVideoElement | null) => {
    webcamRef.current = videoElement;
  }

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      {/* Top Navigation Bar */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl fixed top-0 left-0 right-0 z-30 h-16">
        <div className="h-full flex items-center justify-between px-4">
          {/* Logo and Menu Toggle */}
          <div className="flex items-center">
            <motion.button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-white/10 mr-3 text-white transition-all duration-200"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </motion.button>
            
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Blind Assistant
                </h1>
              </motion.div>
              
              {/* Back to Landing Page Button */}
              <motion.button
                onClick={() => {
                  speak('Navigating to landing page')
                  router.push('/')
                }}
                className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 group"
                aria-label="Back to landing page"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Home</span>
              </motion.button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* System Status Indicators */}
            <div className="hidden md:flex items-center space-x-3 mr-4">
              <motion.div 
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                  systemStatus.camera === 'online' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <Camera className="w-4 h-4" />
                <span className="text-xs font-medium">CAM</span>
              </motion.div>
              
              <motion.div 
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                  systemStatus.microphone === 'online' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <Mic className="w-4 h-4" />
                <span className="text-xs font-medium">MIC</span>
              </motion.div>
              
              <motion.div 
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                  systemStatus.ai === 'online' 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <Brain className="w-4 h-4" />
                <span className="text-xs font-medium">AI</span>
              </motion.div>
            </div>
            
            {/* Voice Command Button */}
            <motion.button
              onClick={() => {
                if (isListening) {
                  stopListening()
                } else {
                  startListening()
                }
              }}
              className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
              }`}
              disabled={systemStatus.microphone === 'offline'}
              aria-label={isListening ? 'Stop voice command' : 'Start voice command'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Waves className="w-4 h-4" />
                  </motion.div>
                  <span>Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Voice</span>
                </>
              )}
            </motion.button>
            
            {/* Camera Toggle Button */}
            <motion.button
              onClick={() => setCameraEnabled(!cameraEnabled)}
              className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                cameraEnabled 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/25'
              }`}
              disabled={systemStatus.camera === 'offline'}
              aria-label={cameraEnabled ? 'Turn off camera' : 'Turn on camera'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cameraEnabled ? (
                <>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.div>
                  <span>Active</span>
                </>
              ) : (
                <>
                  <CameraOff className="w-4 h-4" />
                  <span>Camera</span>
                </>
              )}
            </motion.button>
            
            {/* User Menu */}
            <div className="relative ml-2">
              <div className="relative group">
                <motion.button 
                  className="flex items-center space-x-2 p-1 rounded-xl hover:bg-white/10 transition-all duration-200"
                  aria-label="User menu"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
                  </div>
                </motion.button>
                
                {/* User Menu Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-52 bg-black/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-white/10">
                    <p className="text-sm font-bold text-white">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                    </p>
                    <p className="text-xs text-white/60">
                      {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
                    </p>
                  </div>
                  <div className="p-2">
                    <SignOutButton>
                      <motion.button 
                        className="flex items-center w-full p-3 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </motion.button>
                    </SignOutButton>
                  </div>
                </div>
              </div>
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
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-black/20 backdrop-blur-xl border-r border-white/10 h-full fixed left-0 top-16 z-20 overflow-y-auto"
            >
              <div className="p-6">
                {/* Back to Home Button for Mobile */}
                <motion.button
                  onClick={() => {
                    speak('Navigating to landing page')
                    router.push('/')
                    setSidebarOpen(false)
                  }}
                  className="flex items-center w-full p-4 rounded-xl transition-all duration-200 group text-white/70 hover:text-white hover:bg-white/10 mb-4 md:hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-lg mr-3 bg-white/10 group-hover:bg-white/20">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Back to Home</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </motion.button>
                
                <nav className="space-y-2">
                  <motion.button
                    onClick={() => {
                      setActivePanel('webcam')
                      speak('Camera view activated')
                    }}
                    className={`flex items-center w-full p-4 rounded-xl transition-all duration-200 group ${
                      activePanel === 'webcam' 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      activePanel === 'webcam'
                        ? 'bg-emerald-500/20'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Camera Feed</span>
                    {activePanel === 'webcam' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setActivePanel('detection')
                      speak('Object detection activated')
                    }}
                    className={`flex items-center w-full p-4 rounded-xl transition-all duration-200 group ${
                      activePanel === 'detection' 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      activePanel === 'detection'
                        ? 'bg-purple-500/20'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className="font-medium">AI Detection</span>
                    {activePanel === 'detection' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setActivePanel('navigation')
                      speak('Navigation activated')
                    }}
                    className={`flex items-center w-full p-4 rounded-xl transition-all duration-200 group ${
                      activePanel === 'navigation' 
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      activePanel === 'navigation'
                        ? 'bg-blue-500/20'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Navigation</span>
                    {activePanel === 'navigation' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setActivePanel('voice')
                      speak('Voice commands activated')
                    }}
                    className={`flex items-center w-full p-4 rounded-xl transition-all duration-200 group ${
                      activePanel === 'voice' 
                        ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      activePanel === 'voice'
                        ? 'bg-violet-500/20'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <Headphones className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Voice Control</span>
                    {activePanel === 'voice' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setActivePanel('emergency')
                      speak('Emergency panel activated')
                    }}
                    className={`flex items-center w-full p-4 rounded-xl transition-all duration-200 group ${
                      activePanel === 'emergency' 
                        ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      activePanel === 'emergency'
                        ? 'bg-red-500/20'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Emergency</span>
                    {activePanel === 'emergency' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                </nav>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-xs uppercase text-white/50 font-bold mb-4 px-2 tracking-wider">Quick Settings</h3>
                  <div className="space-y-2">
                    <motion.button
                      onClick={toggleVoice}
                      className={`flex items-center w-full p-4 rounded-xl transition-all duration-200 group ${
                        voiceEnabled
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${
                        voiceEnabled
                          ? 'bg-green-500/20'
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                        {voiceEnabled ? (
                          <Volume2 className="w-5 h-5" />
                        ) : (
                          <VolumeX className="w-5 h-5" />
                        )}
                      </div>
                      <span className="font-medium">Voice Feedback</span>
                      <div className={`ml-auto px-2 py-1 rounded-lg text-xs font-bold ${
                        voiceEnabled
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {voiceEnabled ? 'ON' : 'OFF'}
                      </div>
                    </motion.button>
                  </div>
                  
                  {/* AI Status */}
                  <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm font-medium">AI Status</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          systemStatus.ai === 'online' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <span className={`text-xs font-bold ${
                          systemStatus.ai === 'online' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {systemStatus.ai === 'online' ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-white/50">
                      <div className="flex items-center space-x-1">
                        <Activity className="w-3 h-3" />
                        <span>Processing</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main 
          className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
            sidebarOpen && !isMobile ? 'ml-70' : ''
          }`}
          style={{
            marginLeft: sidebarOpen && !isMobile ? '280px' : '0'
          }}
        >
          {/* Panel Title */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
              {activePanel === 'webcam' && 'Camera Feed'}
              {activePanel === 'detection' && 'AI Object Detection'}
              {activePanel === 'navigation' && 'Smart Navigation'}
              {activePanel === 'voice' && 'Voice Control'}
              {activePanel === 'emergency' && 'Emergency Services'}
            </h1>
            <p className="text-white/60 text-lg">
              {activePanel === 'webcam' && 'View your surroundings with enhanced visual clarity'}
              {activePanel === 'detection' && 'AI-powered object identification and analysis'}
              {activePanel === 'navigation' && 'Intelligent guidance and location services'}
              {activePanel === 'voice' && 'Natural language control and commands'}
              {activePanel === 'emergency' && 'Quick access to emergency services and alerts'}
            </p>
          </motion.div>
          
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
                        onVideoRef={setWebcamVideoRef}
                        ref={webcamFeedRef}
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
                          onVideoRef={setWebcamVideoRef}
                          ref={webcamFeedRef}
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
                    webcamRef={webcamRef.current}
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