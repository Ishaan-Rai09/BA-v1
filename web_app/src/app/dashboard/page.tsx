'use client'

import { useState, useEffect } from 'react'
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
      speak('Object detection panel opened')
    } else if (lowerCommand.includes('emergency') || lowerCommand.includes('help')) {
      setActivePanel('emergency')
      speak('Emergency panel activated')
    } else if (lowerCommand.includes('voice') || lowerCommand.includes('commands')) {
      setActivePanel('voice')
      speak('Voice command panel opened')
    }
  }

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
              className={`relative ${isListening ? 'voice-command-listening' : ''} ${isProcessing ? 'voice-command-processing' : ''}`}
              disabled={systemStatus.microphone === 'offline'}
              aria-label={isListening ? 'Stop voice command' : 'Start voice command'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </LuxuryButton>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-slate-100 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                  {user.firstName[0]}
                </div>
                <span className="hidden md:inline-block font-medium">
                  {user.firstName}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 shadow-sm z-20 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Main Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="mb-8">
              <h2 className="text-xs uppercase text-slate-500 font-semibold mb-2 px-2">Main</h2>
              <ul className="space-y-1">
                <li>
                  <a 
                    href="/dashboard" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary-50 text-primary-700"
                  >
                    <Home className="w-5 h-5" />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/dashboard/analytics" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Analytics</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xs uppercase text-slate-500 font-semibold mb-2 px-2">Features</h2>
              <ul className="space-y-1">
                {[
                  { id: 'webcam', label: 'Camera Feed', icon: Camera },
                  { id: 'voice', label: 'Voice Commands', icon: Mic },
                  { id: 'navigation', label: 'Navigation', icon: Navigation },
                  { id: 'detection', label: 'Object Detection', icon: Eye },
                  { id: 'emergency', label: 'Emergency', icon: AlertTriangle }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActivePanel(item.id as any)
                        speak(`${item.label} panel opened`)
                        if (isMobile) setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300 ${
                        activePanel === item.id 
                          ? 'bg-primary-50 text-primary-700' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                      aria-label={`Open ${item.label}`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${activePanel === item.id ? 'rotate-90' : ''}`} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xs uppercase text-slate-500 font-semibold mb-2 px-2">Support</h2>
              <ul className="space-y-1">
                <li>
                  <a 
                    href="/dashboard/help" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Help & Support</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/dashboard/settings" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          
          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-200">
            <button 
              onClick={() => {
                toggleHighContrast()
                speak(highContrast ? 'High contrast disabled' : 'High contrast enabled')
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-700 mb-2"
            >
              <span>High Contrast</span>
              <div className={`w-10 h-5 rounded-full p-1 transition-colors ${highContrast ? 'bg-primary-600' : 'bg-slate-300'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${highContrast ? 'translate-x-5' : ''}`}></div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                toggleVoice()
                speak(voiceEnabled ? 'Voice disabled' : 'Voice enabled')
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              <span>Voice Feedback</span>
              <div className={`w-10 h-5 rounded-full p-1 transition-colors ${voiceEnabled ? 'bg-primary-600' : 'bg-slate-300'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${voiceEnabled ? 'translate-x-5' : ''}`}></div>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-3 py-2 mt-4 rounded-lg text-red-600 hover:bg-red-50">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user.firstName}. Your assistive technology is ready.</p>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <LuxuryButton
              onClick={() => {
                setCameraEnabled(!cameraEnabled)
                setActivePanel('webcam')
                speak(cameraEnabled ? 'Camera disabled' : 'Camera enabled')
              }}
              className={`flex items-center justify-center space-x-2 ${cameraEnabled ? 'bg-green-600 hover:bg-green-700' : ''}`}
              disabled={systemStatus.camera === 'offline'}
              aria-label={cameraEnabled ? 'Disable camera' : 'Enable camera'}
            >
              {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              <span className="hidden md:inline">{cameraEnabled ? 'Disable Camera' : 'Enable Camera'}</span>
            </LuxuryButton>

            <LuxuryButton
              onClick={() => {
                setActivePanel('navigation')
                speak('Navigation panel opened')
              }}
              className="flex items-center justify-center space-x-2"
              aria-label="Open navigation"
            >
              <Navigation className="w-5 h-5" />
              <span className="hidden md:inline">Navigate</span>
            </LuxuryButton>

            <LuxuryButton
              onClick={() => {
                setActivePanel('detection')
                speak('Object detection panel opened')
              }}
              className="flex items-center justify-center space-x-2"
              aria-label="Object detection"
            >
              <Eye className="w-5 h-5" />
              <span className="hidden md:inline">Detect Objects</span>
            </LuxuryButton>

            <LuxuryButton
              onClick={() => {
                setActivePanel('emergency')
                speak('Emergency panel activated')
              }}
              className="bg-red-600 hover:bg-red-700 flex items-center justify-center space-x-2"
              aria-label="Emergency assistance"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="hidden md:inline">Emergency</span>
            </LuxuryButton>
          </div>

          {/* Main Panel */}
          <motion.div
            key={activePanel}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {activePanel === 'webcam' && (
              <LuxuryCard className="p-6" variant="elevated">
                <h2 className="text-2xl font-serif font-bold mb-4 flex items-center">
                  <Camera className="w-6 h-6 mr-2 text-primary-600" />
                  Live Camera Feed
                </h2>
                <WebcamFeed 
                  enabled={cameraEnabled}
                  onDetection={(objects) => {
                    // Only announce significant objects with high confidence
                    const significantObjects = objects.filter(obj => obj.confidence > 70)
                    if (significantObjects.length > 0) {
                      const topObject = significantObjects[0]
                      speak(`${topObject.label} detected`)
                    }
                  }}
                />
              </LuxuryCard>
            )}

            {activePanel === 'voice' && (
              <LuxuryCard className="p-6" variant="elevated">
                <h2 className="text-2xl font-serif font-bold mb-4 flex items-center">
                  <Mic className="w-6 h-6 mr-2 text-primary-600" />
                  Voice Commands
                </h2>
                <VoiceCommandPanel 
                  onCommand={handleVoiceCommand}
                  isListening={isListening}
                  isProcessing={isProcessing}
                />
              </LuxuryCard>
            )}

            {activePanel === 'navigation' && (
              <LuxuryCard className="p-6" variant="elevated">
                <h2 className="text-2xl font-serif font-bold mb-4 flex items-center">
                  <Navigation className="w-6 h-6 mr-2 text-primary-600" />
                  Navigation
                </h2>
                <NavigationPanel 
                  onLocationFound={(location) => {
                    speak(`Location found: ${location.address}`)
                  }}
                  onDirectionsReady={(directions) => {
                    speak(`Directions ready. ${directions.length} steps to your destination.`)
                  }}
                />
              </LuxuryCard>
            )}

            {activePanel === 'detection' && (
              <LuxuryCard className="p-6" variant="elevated">
                <h2 className="text-2xl font-serif font-bold mb-4 flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-primary-600" />
                  Object Detection
                </h2>
                <ObjectDetectionPanel 
                  cameraEnabled={cameraEnabled}
                  onObjectDetected={(object) => {
                    speak(`${object.label} detected`)
                  }}
                />
              </LuxuryCard>
            )}

            {activePanel === 'emergency' && (
              <LuxuryCard className="p-6" variant="elevated">
                <h2 className="text-2xl font-serif font-bold mb-4 flex items-center text-red-600">
                  <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                  Emergency
                </h2>
                <EmergencyPanel 
                  onEmergencyTriggered={(type) => {
                    speak(`Emergency ${type} activated. Finding nearest assistance.`)
                  }}
                />
              </LuxuryCard>
            )}
          </motion.div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LuxuryCard className="p-6" variant="glass">
              <h3 className="text-lg font-medium mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Camera</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    systemStatus.camera === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.camera === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Microphone</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    systemStatus.microphone === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.microphone === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Location</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    systemStatus.location === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.location === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">AI Services</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    systemStatus.ai === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.ai === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6" variant="glass">
              <h3 className="text-lg font-medium mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-slate-50' : 'bg-blue-50'}`}>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-slate-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No new notifications</p>
                )}
              </div>
            </LuxuryCard>

            <LuxuryCard className="p-6" variant="glass">
              <h3 className="text-lg font-medium mb-4">Quick Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <Mic className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Voice Commands</h4>
                    <p className="text-xs text-slate-600">Say "Navigate to [location]" for directions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <Eye className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Object Detection</h4>
                    <p className="text-xs text-slate-600">Say "What's in front of me?" to scan surroundings</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <AlertTriangle className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Emergency</h4>
                    <p className="text-xs text-slate-600">Say "Emergency" or press the red button for help</p>
                  </div>
                </div>
              </div>
            </LuxuryCard>
          </div>
        </div>
      </main>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Voice Command Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-glow z-40"
          >
            <Mic className="w-6 h-6 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 