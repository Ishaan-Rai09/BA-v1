'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Check, Camera, Mic, Navigation, AlertTriangle, Eye } from 'lucide-react'
import { LuxuryButton } from './LuxuryButton'
import { LuxuryCard } from './LuxuryCard'
import { useVoice } from '@/contexts/VoiceContext'

interface WelcomeModalProps {
  onClose: () => void
  onComplete: () => void
}

export function WelcomeModal({ onClose, onComplete }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next')
  const { speak } = useVoice()

  const steps = [
    {
      title: "Welcome to Blind Assistant",
      description: "Your luxury assistive technology platform designed for accessibility and independence.",
      content: "Experience a world-class solution that combines cutting-edge AI with elegant design to provide unparalleled assistance for visually impaired users.",
      icon: Eye,
      color: "from-luxury-gold to-luxury-darkGold",
      image: "/assets/images/welcome/welcome.jpg"
    },
    {
      title: "Voice Commands",
      description: "Control the application using your voice for hands-free operation.",
      content: "Our advanced natural language processing understands complex commands and responds with crystal-clear audio feedback in multiple languages.",
      icon: Mic,
      color: "from-blue-500 to-blue-700",
      image: "/assets/images/welcome/voice.jpg"
    },
    {
      title: "Object Detection",
      description: "Real-time object detection helps you understand your surroundings.",
      content: "State-of-the-art computer vision identifies people, obstacles, vehicles, and more with precise distance estimation and spatial awareness.",
      icon: Camera,
      color: "from-purple-500 to-purple-700",
      image: "/assets/images/welcome/camera.jpg"
    },
    {
      title: "Navigation",
      description: "Turn-by-turn navigation with voice guidance.",
      content: "Get detailed directions with landmark recognition, obstacle warnings, and real-time public transit information to reach your destination safely.",
      icon: Navigation,
      color: "from-green-500 to-green-700",
      image: "/assets/images/welcome/navigation.jpg"
    },
    {
      title: "Emergency Services",
      description: "Quick access to emergency assistance when needed.",
      content: "One-touch access to medical, police, or fire services with automatic location sharing and critical information relay.",
      icon: AlertTriangle,
      color: "from-red-500 to-red-700",
      image: "/assets/images/welcome/emergency.jpg"
    }
  ]

  useEffect(() => {
    // Announce the current step for accessibility
    speak(steps[currentStep].title + ". " + steps[currentStep].description)
  }, [currentStep, speak])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setAnimationDirection('next')
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setAnimationDirection('prev')
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    speak("Welcome tutorial skipped")
    onClose()
  }

  const slideVariants = {
    hiddenNext: { x: 50, opacity: 0 },
    hiddenPrev: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <LuxuryCard className="overflow-hidden p-0" variant="frosted" glowing>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-64 md:h-auto overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${steps[currentStep].color} opacity-90 z-10`}></div>
              <div className="absolute inset-0 bg-[url('/assets/images/patterns/grid.svg')] opacity-20 z-20"></div>
              
              <motion.div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                style={{ backgroundImage: `url(${steps[currentStep].image || '/assets/images/welcome/default.jpg'})` }}
              />
              
              <div className="absolute inset-0 z-30 flex flex-col justify-center items-center text-white p-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-4"
                >
                  {React.createElement(steps[currentStep].icon, { className: "w-12 h-12" })}
                </motion.div>
                
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-2xl md:text-3xl font-serif font-bold text-center mb-3"
                >
                  {steps[currentStep].title}
                </motion.h2>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-center text-white/90"
                >
                  {steps[currentStep].description}
                </motion.p>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium">
                  Step {currentStep + 1} of {steps.length}
                </h3>
                <button
                  onClick={handleSkip}
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                  aria-label="Skip tutorial"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-8 min-h-[100px]">
                <motion.div
                  key={currentStep}
                  initial={animationDirection === 'next' ? 'hiddenNext' : 'hiddenPrev'}
                  animate="visible"
                  variants={slideVariants}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <p className="text-base leading-relaxed text-slate-700">
                    {steps[currentStep].content}
                  </p>
                </motion.div>
              </div>

              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex space-x-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setAnimationDirection(index > currentStep ? 'next' : 'prev')
                        setCurrentStep(index)
                      }}
                      className="group"
                      aria-label={`Go to step ${index + 1}`}
                    >
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentStep
                            ? 'bg-primary-600 w-10'
                            : index < currentStep
                            ? 'bg-green-500 w-6'
                            : 'bg-slate-300 group-hover:bg-slate-400 w-6'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center">
                <LuxuryButton
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="flex items-center space-x-2"
                  iconPosition="left"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </LuxuryButton>

                <div className="flex space-x-3">
                  <LuxuryButton
                    onClick={handleSkip}
                    variant="ghost"
                  >
                    Skip
                  </LuxuryButton>
                  
                  <LuxuryButton
                    onClick={handleNext}
                    className="flex items-center space-x-2"
                    variant={currentStep === steps.length - 1 ? 'gold' : 'primary'}
                    glowing={currentStep === steps.length - 1}
                    iconPosition="right"
                  >
                    <span>
                      {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                    </span>
                    {currentStep === steps.length - 1 ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </LuxuryButton>
                </div>
              </div>
            </div>
          </div>
        </LuxuryCard>
      </motion.div>
    </div>
  )
}
