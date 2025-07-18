'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

interface AccessibilityContextType {
  highContrast: boolean
  fontSize: 'normal' | 'large' | 'extra-large'
  reducedMotion: boolean
  screenReaderMode: boolean
  toggleHighContrast: () => void
  increaseFontSize: () => void
  decreaseFontSize: () => void
  toggleReducedMotion: () => void
  toggleScreenReaderMode: () => void
  announceScreenReader: (message: string) => void
  setFocusToMain: () => void
  announcePageChange: (title: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

interface AccessibilityProviderProps {
  children: ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReaderMode, setScreenReaderMode] = useState(false)
  const [announcer, setAnnouncer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Load preferences from localStorage
    const savedHighContrast = localStorage.getItem('accessibilityHighContrast')
    const savedFontSize = localStorage.getItem('accessibilityFontSize')
    const savedReducedMotion = localStorage.getItem('accessibilityReducedMotion')
    const savedScreenReaderMode = localStorage.getItem('accessibilityScreenReaderMode')

    if (savedHighContrast) {
      setHighContrast(JSON.parse(savedHighContrast))
    }
    if (savedFontSize) {
      setFontSize(savedFontSize as 'normal' | 'large' | 'extra-large')
    }
    if (savedReducedMotion) {
      setReducedMotion(JSON.parse(savedReducedMotion))
    }
    if (savedScreenReaderMode) {
      setScreenReaderMode(JSON.parse(savedScreenReaderMode))
    }

    // Check for system preferences
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setHighContrast(true)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true)
    }

    // Create screen reader announcer
    const announcerElement = document.createElement('div')
    announcerElement.setAttribute('aria-live', 'polite')
    announcerElement.setAttribute('aria-atomic', 'true')
    announcerElement.className = 'sr-only'
    announcerElement.id = 'accessibility-announcer'
    document.body.appendChild(announcerElement)
    setAnnouncer(announcerElement)

    // Set up keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + H: Toggle high contrast
      if (event.altKey && event.key === 'h') {
        event.preventDefault()
        toggleHighContrast()
      }
      // Alt + +: Increase font size
      if (event.altKey && event.key === '+') {
        event.preventDefault()
        increaseFontSize()
      }
      // Alt + -: Decrease font size
      if (event.altKey && event.key === '-') {
        event.preventDefault()
        decreaseFontSize()
      }
      // Alt + M: Toggle reduced motion
      if (event.altKey && event.key === 'm') {
        event.preventDefault()
        toggleReducedMotion()
      }
      // Alt + S: Toggle screen reader mode
      if (event.altKey && event.key === 's') {
        event.preventDefault()
        toggleScreenReaderMode()
      }
      // Alt + 1: Focus main content
      if (event.altKey && event.key === '1') {
        event.preventDefault()
        setFocusToMain()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (announcerElement) {
        document.body.removeChild(announcerElement)
      }
    }
  }, [])

  useEffect(() => {
    // Apply high contrast class to body
    if (highContrast) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }
  }, [highContrast])

  useEffect(() => {
    // Apply font size class to body
    document.body.classList.remove('font-normal', 'font-large', 'font-extra-large')
    document.body.classList.add(`font-${fontSize}`)
  }, [fontSize])

  useEffect(() => {
    // Apply reduced motion class to body
    if (reducedMotion) {
      document.body.classList.add('reduced-motion')
    } else {
      document.body.classList.remove('reduced-motion')
    }
  }, [reducedMotion])

  useEffect(() => {
    // Apply screen reader mode class to body
    if (screenReaderMode) {
      document.body.classList.add('screen-reader-mode')
    } else {
      document.body.classList.remove('screen-reader-mode')
    }
  }, [screenReaderMode])

  const toggleHighContrast = useCallback(() => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem('accessibilityHighContrast', JSON.stringify(newValue))
    announceScreenReader(`High contrast ${newValue ? 'enabled' : 'disabled'}`)
  }, [highContrast])

  const increaseFontSize = useCallback(() => {
    let newSize: 'normal' | 'large' | 'extra-large' = 'normal'
    
    if (fontSize === 'normal') {
      newSize = 'large'
    } else if (fontSize === 'large') {
      newSize = 'extra-large'
    } else {
      newSize = 'extra-large' // Already at max
    }
    
    setFontSize(newSize)
    localStorage.setItem('accessibilityFontSize', newSize)
    announceScreenReader(`Font size increased to ${newSize}`)
  }, [fontSize])

  const decreaseFontSize = useCallback(() => {
    let newSize: 'normal' | 'large' | 'extra-large' = 'normal'
    
    if (fontSize === 'extra-large') {
      newSize = 'large'
    } else if (fontSize === 'large') {
      newSize = 'normal'
    } else {
      newSize = 'normal' // Already at min
    }
    
    setFontSize(newSize)
    localStorage.setItem('accessibilityFontSize', newSize)
    announceScreenReader(`Font size decreased to ${newSize}`)
  }, [fontSize])

  const toggleReducedMotion = useCallback(() => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem('accessibilityReducedMotion', JSON.stringify(newValue))
    announceScreenReader(`Reduced motion ${newValue ? 'enabled' : 'disabled'}`)
  }, [reducedMotion])

  const toggleScreenReaderMode = useCallback(() => {
    const newValue = !screenReaderMode
    setScreenReaderMode(newValue)
    localStorage.setItem('accessibilityScreenReaderMode', JSON.stringify(newValue))
    announceScreenReader(`Screen reader mode ${newValue ? 'enabled' : 'disabled'}`)
  }, [screenReaderMode])

  const announceScreenReader = useCallback((message: string) => {
    if (announcer) {
      announcer.textContent = message
      // Clear after a delay to allow for multiple announcements
      setTimeout(() => {
        if (announcer) {
          announcer.textContent = ''
        }
      }, 1000)
    }
  }, [announcer])

  const setFocusToMain = useCallback(() => {
    const mainElement = document.getElementById('main-content')
    if (mainElement) {
      mainElement.focus()
      announceScreenReader('Main content focused')
    }
  }, [])

  const announcePageChange = useCallback((title: string) => {
    announceScreenReader(`Page changed to ${title}`)
  }, [])

  const value: AccessibilityContextType = {
    highContrast,
    fontSize,
    reducedMotion,
    screenReaderMode,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    toggleReducedMotion,
    toggleScreenReaderMode,
    announceScreenReader,
    setFocusToMain,
    announcePageChange,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
