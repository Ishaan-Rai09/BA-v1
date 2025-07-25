'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth, SignInButton } from '@clerk/nextjs'
import { 
  Mic, 
  Eye,
  Navigation,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Shield,
  Star,
  CheckCircle,
  Sparkles,
  Crown,
  Award
} from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  size = 'md' 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4'
  
  const variants = {
    primary: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900 hover:from-yellow-400 hover:to-yellow-500 focus:ring-yellow-300 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 focus:ring-blue-300 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-300'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export default function LandingPage() {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                Blind Assistant
              </span>
            </div>
            
            {isSignedIn && (
              <Button onClick={() => router.push('/dashboard')} variant="secondary" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </nav>
      

      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        isSignedIn ? 'pt-16' : ''
      }`}>
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20"></div>
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1.2, 1, 1.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"
            animate={{
              x: [0, 120, -60, 0],
              y: [0, -80, 40, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-blue-900 mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">Blind</span>
                <span className="bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent"> Assistant</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-blue-800 mb-8 max-w-3xl mx-auto font-medium"
            >
              A world-class luxury assistive technology platform designed to enhance independence through voice commands, real-time object detection, and navigation assistance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isSignedIn ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900 font-medium group"
                >
                  <span className="flex items-center">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900 font-medium group"
                  >
                    <span className="flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </SignInButton>
              )}

              <Button
                onClick={() => scrollToSection('features')}
                variant="outline"
                size="lg"
                className="border border-blue-600 text-blue-800 hover:bg-blue-50 font-medium"
              >
                Explore Features
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-16 flex flex-wrap justify-center gap-6 text-blue-800 font-medium"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-yellow-500" />
                <span>WCAG 2.1 AAA Compliant</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-yellow-500" />
                <span>Privacy Focused</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
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
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-blue-800 font-medium"
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
      <section id="features" className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              Premium Features
            </h2>
            <p className="text-xl text-blue-800 max-w-3xl mx-auto">
              Experience unparalleled assistive technology with our suite of premium features designed for accessibility and independence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-blue-100">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-blue-900">Voice Commands</h3>
              <p className="text-blue-700 mb-4">
                Control the entire application with natural voice commands for a truly hands-free experience.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-blue-800">Natural language processing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-blue-800">Contextual understanding</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-blue-800">Multi-language support</span>
                </li>
              </ul>
              {isSignedIn ? (
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900"
                >
                  Try Voice Commands
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900"
                  >
                    Try Voice Commands
                  </Button>
                </SignInButton>
              )}
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-blue-100">
              <div className="bg-gradient-to-br from-blue-700 to-blue-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-blue-900">Object Detection</h3>
              <p className="text-blue-700 mb-4">
                Advanced AI-powered object detection provides real-time information about your surroundings.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-blue-800">Real-time identification</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-blue-800">Distance estimation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-blue-800">Obstacle warnings</span>
                </li>
              </ul>
              {isSignedIn ? (
                <Button 
                  onClick={() => router.push('/dashboard')}
                  variant="secondary"
                  className="w-full"
                >
                  Try Object Detection
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    variant="secondary"
                    className="w-full"
                  >
                    Try Object Detection
                  </Button>
                </SignInButton>
              )}
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-blue-100">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Navigation className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-blue-900">Navigation</h3>
              <p className="text-blue-700 mb-4">
                Intelligent navigation assistance to help you reach your destination safely and efficiently.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-blue-800">Voice-guided directions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-blue-800">Landmark recognition</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-blue-800">Accessible route planning</span>
                </li>
              </ul>
              {isSignedIn ? (
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900"
                >
                  Try Navigation
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900"
                  >
                    Try Navigation
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-16 text-center">
            {isSignedIn ? (
              <Button
                onClick={() => router.push('/dashboard')}
                size="lg"
                variant="secondary"
                className="group"
              >
                <span className="flex items-center">
                  Access Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group"
                >
                  <span className="flex items-center">
                    Sign In to Access Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-blue-800 max-w-3xl mx-auto">
              Experience seamless assistive technology in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-luxury-gold to-luxury-darkGold rounded-full flex items-center justify-center shadow-gold">
                  <span className="text-2xl font-bold text-black">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Sign Up & Authenticate</h3>
              <p className="text-blue-800">
                Create your secure account with our premium authentication system and personalize your accessibility preferences.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-luxury-royal to-luxury-midnight rounded-full flex items-center justify-center shadow-glow">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Choose Your Tools</h3>
              <p className="text-blue-800">
                Access our suite of AI-powered tools: voice commands, object detection, navigation, and emergency assistance.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-glow">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-luxury-gold rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Experience Freedom</h3>
              <p className="text-blue-800">
                Navigate your world with confidence using our advanced assistive technology designed for independence.
              </p>
            </motion.div>
          </div>

          {/* Demo Video or Interactive Preview */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-luxury overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-luxury-gold/20 opacity-50" />
              <div className="absolute top-4 right-4 w-32 h-32 bg-luxury-gold/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 text-center">
                <h3 className="text-3xl font-serif font-bold text-white mb-4">
                  Ready to Experience Luxury Accessibility?
                </h3>
                <p className="text-white mb-8 max-w-2xl mx-auto">
                  Join thousands of users who have transformed their daily navigation with our award-winning assistive technology platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isSignedIn ? (
                    <Button
                      onClick={() => router.push('/dashboard')}
                      size="lg"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium px-8 py-4 text-lg rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
                    >
                      <span className="flex items-center">
                        Launch Dashboard
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </span>
                    </Button>
                  ) : (
                    <SignInButton mode="modal">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium px-8 py-4 text-lg rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
                      >
                        <span className="flex items-center">
                          Start Free Trial
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </span>
                      </Button>
                    </SignInButton>
                  )}
                  
                  <Button
                    onClick={() => scrollToSection('features')}
                    variant="ghost"
                    size="lg"
                    className="border border-white text-white font-semibold hover:bg-white/20 px-8 py-4 text-lg rounded-xl transition-all duration-300 shadow-md"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-midnight text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-serif font-bold mb-4 bg-gradient-to-r from-luxury-gold to-luxury-darkGold bg-clip-text text-transparent">
                Blind Assistant
              </h3>
              <p className="text-slate-300 mb-6 max-w-md">
                Premium assistive technology platform designed to enhance independence and accessibility for visually impaired users worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-luxury-gold" />
                  <span className="text-sm text-slate-300">Privacy First</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-luxury-gold" />
                  <span className="text-sm text-slate-300">WCAG Compliant</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-luxury-gold transition-colors">Voice Commands</a></li>
                <li><a href="#" className="text-slate-300 hover:text-luxury-gold transition-colors">Object Detection</a></li>
                <li><a href="#" className="text-slate-300 hover:text-luxury-gold transition-colors">Navigation</a></li>
                <li><a href="#" className="text-slate-300 hover:text-luxury-gold transition-colors">Emergency Services</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-luxury-gold transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-300 hover:text-luxury-gold transition-colors">Accessibility Guide</a></li>
                <li><a href="#" className="text-slate-300 hover:text-luxury-gold transition-colors">Contact Support</a></li>
                <li><a href="#" className="text-slate-300 hover:text-luxury-gold transition-colors">Community</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400">
              © 2024 Blind Assistant. All rights reserved. Crafted with accessibility and luxury in mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
