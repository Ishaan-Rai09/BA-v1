import { forwardRef, HTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type LuxuryCardProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'elevated' | 'gradient' | 'gold' | 'dark' | 'minimal' | 'frosted'
  animation?: boolean
  hoverable?: boolean
  glowing?: boolean
  bordered?: boolean
}

const LuxuryCard = forwardRef<HTMLDivElement, LuxuryCardProps>(
  ({ 
    className, 
    children, 
    variant = 'default', 
    animation = true, 
    hoverable = false,
    glowing = false,
    bordered = false,
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-white/90 backdrop-blur-sm border border-white/20 shadow-md',
      glass: 'bg-white/20 backdrop-blur-md border border-white/30 shadow-sm',
      elevated: 'bg-white shadow-lg border border-slate-100',
      gradient: 'bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm border border-white/20 shadow-md',
      gold: 'bg-gradient-to-br from-[#f7f2e2] to-[#f0e9d2] border border-luxury-gold/20 shadow-gold',
      dark: 'bg-slate-900/90 backdrop-blur-sm border border-slate-800/50 shadow-md text-white',
      minimal: 'bg-white border border-slate-200',
      frosted: 'bg-white/70 backdrop-blur-md border border-white/40 shadow-sm'
    }
    
    const hoverEffects = {
      default: 'hover:shadow-lg hover:border-white/30 transition-all duration-300',
      glass: 'hover:bg-white/30 hover:border-white/40 transition-all duration-300',
      elevated: 'hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300',
      gradient: 'hover:shadow-lg hover:from-white to-slate-100/95 transition-all duration-300',
      gold: 'hover:shadow-gold hover:brightness-105 transition-all duration-300',
      dark: 'hover:bg-slate-800/90 hover:border-slate-700/50 transition-all duration-300',
      minimal: 'hover:border-slate-300 hover:shadow-sm transition-all duration-300',
      frosted: 'hover:bg-white/80 hover:border-white/50 transition-all duration-300'
    }
    
    const glowEffects = {
      default: 'shadow-[0_0_30px_rgba(255,255,255,0.3)]',
      glass: 'shadow-[0_0_30px_rgba(255,255,255,0.4)]',
      elevated: 'shadow-[0_0_30px_rgba(203,213,225,0.4)]',
      gradient: 'shadow-[0_0_30px_rgba(241,245,249,0.4)]',
      gold: 'shadow-[0_0_30px_rgba(212,175,55,0.3)]',
      dark: 'shadow-[0_0_30px_rgba(15,23,42,0.5)]',
      minimal: 'shadow-[0_0_20px_rgba(226,232,240,0.5)]',
      frosted: 'shadow-[0_0_30px_rgba(255,255,255,0.4)]'
    }
    
    const borderEffects = {
      default: 'border-2 border-white/40',
      glass: 'border-2 border-white/50',
      elevated: 'border-2 border-slate-200',
      gradient: 'border-2 border-slate-100/80',
      gold: 'border-2 border-luxury-gold/30',
      dark: 'border-2 border-slate-700',
      minimal: 'border-2 border-slate-300',
      frosted: 'border-2 border-white/60'
    }

    const cardClasses = cn(
      'rounded-2xl overflow-hidden',
      'dark:bg-slate-900/90 dark:border-slate-700/50',
      variants[variant],
      hoverable && hoverEffects[variant],
      glowing && glowEffects[variant],
      bordered && borderEffects[variant],
      className
    )

    if (animation) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {children}
      </div>
    )
  }
)

LuxuryCard.displayName = 'LuxuryCard'

export { LuxuryCard }
