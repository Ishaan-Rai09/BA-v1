'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  Camera, 
  Navigation, 
  AlertTriangle,
  Eye,
  ArrowRight,
  ChevronRight,
  Shield,
  MapPin,
  Volume2,
  Star,
  CheckCircle
} from 'lucide-react'
import { useVoice } from '@/contexts/VoiceContext'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { LuxuryButton } from '@/components/common/ui/LuxuryButton'
import { LuxuryCard } from '@/components/common/ui/LuxuryCard'
import { WelcomeModal } from '@/components/common/ui/WelcomeModal'

export default function LandingPage() {
  const { speak } = useVoice()
  const { highContrast, announceScreenReader } = useAccessibility()
  const [showWelcome, setShowWelcome] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 })
  const [particles, setParticles] = useState<Array<{ x: number, y: number, opacity: number }>>([])

  // Initialize window size and particles safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      })
      
      // Generate particles with initial positions
      const newParticles = Array.from({ length: 20 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.5 + 0.3
      }))
      
      setParticles(newParticles)
    }
    
    setIsLoaded(true)
    
    // Check if API is available
    fetch('/api/health').catch(() => {
      console.log('API not available')
    })
    
    // Announce page loaded for screen readers
    setTimeout(() => {
      announceScreenReader('Blind Assistant landing page loaded')
    }, 1000)
    
    // Handle window resize
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleGetStarted = () => {
    setShowWelcome(true)
    speak('Welcome to Blind Assistant')
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      speak(`Scrolled to ${id} section`)
    }
  }

  return (
    <div className={`min-h-screen ${highContrast ? 'high-contrast' : ''}`}>
      {/* Welcome Modal */}
      {showWelcome && (
        <WelcomeModal 
          onClose={() => setShowWelcome(false)}
          onComplete={() => {
            setShowWelcome(false)
            window.location.href = '/dashboard'
          }}
        />
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-luxury-midnight via-luxury-deepBlue to-primary-900 opacity-90"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/grid.svg')] opacity-20"></div>
          
          {/* Luxury Overlay Elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-luxury-gold/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl"></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 z-0">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/30"
              initial={{ 
                x: particle.x, 
                y: particle.y,
                opacity: particle.opacity
              }}
              animate={{ 
                x: [
                  particle.x,
                  particle.x + (Math.random() * 200 - 100),
                  particle.x
                ],
                y: [
                  particle.y,
                  particle.y + (Math.random() * 200 - 100),
                  particle.y
                ]
              }}
              transition={{ 
                duration: 15 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-luxury-platinum bg-clip-text text-transparent">Blind</span>
                <span className="bg-gradient-to-r from-luxury-gold to-luxury-darkGold bg-clip-text text-transparent"> Assistant</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              A world-class luxury assistive technology platform designed to enhance independence through voice commands, real-time object detection, and navigation assistance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <LuxuryButton
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-luxury-gold to-luxury-darkGold text-black font-medium group"
              >
                <span className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </LuxuryButton>

              <LuxuryButton
                onClick={() => scrollToSection('features')}
                variant="ghost"
                size="lg"
                className="border border-white/30 text-white hover:bg-white/10"
              >
                Explore Features
              </LuxuryButton>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-16 flex flex-wrap justify-center gap-6 text-white/80"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-luxury-gold" />
                <span>WCAG 2.1 AAA Compliant</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-luxury-gold" />
                <span>Privacy Focused</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-luxury-gold" />
                <span>Award-Winning Design</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight className="w-6 h-6 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-luxury-midnight to-primary-700 bg-clip-text text-transparent">
              Premium Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience unparalleled assistive technology with our suite of premium features designed for accessibility and independence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <LuxuryCard variant="gradient" className="p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Voice Commands</h3>
              <p className="text-slate-600 mb-4">
                Control the entire application with natural voice commands for a truly hands-free experience.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Natural language processing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Contextual understanding</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Multi-language support</span>
                </li>
              </ul>
              <LuxuryButton 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gradient-to-r from-luxury-gold to-luxury-darkGold text-black"
              >
                Try Voice Commands
              </LuxuryButton>
            </LuxuryCard>

            {/* Feature 2 */}
            <LuxuryCard variant="gradient" className="p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-br from-luxury-royal to-luxury-midnight w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Object Detection</h3>
              <p className="text-slate-600 mb-4">
                Advanced AI-powered object detection provides real-time information about your surroundings.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Real-time identification</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Distance estimation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Obstacle warnings</span>
                </li>
              </ul>
              <LuxuryButton 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gradient-to-r from-luxury-royal to-luxury-midnight text-white"
              >
                Try Object Detection
              </LuxuryButton>
            </LuxuryCard>

            {/* Feature 3 */}
            <LuxuryCard variant="gradient" className="p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Navigation</h3>
              <p className="text-slate-600 mb-4">
                Intelligent navigation assistance to help you reach your destination safely and efficiently.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Voice-guided directions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Landmark recognition</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Accessible route planning</span>
                </li>
              </ul>
              <LuxuryButton 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white"
              >
                Try Navigation
              </LuxuryButton>
            </LuxuryCard>
          </div>

          {/* CTA Button */}
          <div className="mt-16 text-center">
            <LuxuryButton
              onClick={() => window.location.href = '/dashboard'}
              size="lg"
              className="bg-gradient-to-r from-luxury-midnight to-primary-700 text-white group"
            >
              <span className="flex items-center">
                Access Dashboard
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </LuxuryButton>
          </div>
        </div>
      </section>
    </div>
  )
}
