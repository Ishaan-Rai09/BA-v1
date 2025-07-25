import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils/utils'

type LuxuryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline' | 'gold'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  glowing?: boolean
  children: React.ReactNode
  fullWidth?: boolean
  iconPosition?: 'left' | 'right'
}

const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading, 
    disabled, 
    children, 
    glowing = false,
    fullWidth = false,
    iconPosition = 'left',
    ...props 
  }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg',
      secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-md hover:shadow-lg',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg',
      success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg',
      warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-md hover:shadow-lg',
      ghost: 'bg-white/10 text-foreground hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30',
      outline: 'bg-transparent border-2 border-primary-500 text-primary-700 hover:bg-primary-50',
      gold: 'bg-gradient-to-r from-luxury-gold to-luxury-darkGold text-black hover:brightness-105 shadow-gold'
    }

    const sizes = {
      xs: 'px-2 py-1 text-xs rounded-lg',
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-10 py-5 text-xl rounded-2xl'
    }

    const glowEffects = {
      primary: 'shadow-[0_0_15px_rgba(14,165,233,0.5)]',
      secondary: 'shadow-[0_0_15px_rgba(100,116,139,0.5)]',
      danger: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
      success: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
      warning: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      ghost: 'shadow-[0_0_15px_rgba(255,255,255,0.3)]',
      outline: 'shadow-[0_0_15px_rgba(14,165,233,0.3)]',
      gold: 'shadow-[0_0_20px_rgba(212,175,55,0.6)]'
    }

    const buttonClasses = cn(
      'relative font-medium transition-all duration-300 transform',
      'focus-visible-enhanced',
      'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:filter disabled:grayscale',
      'after:content-[""] after:absolute after:inset-0 after:z-[-1] after:rounded-[inherit] after:opacity-0 after:transition-opacity hover:after:opacity-100',
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      glowing && glowEffects[variant],
      className
    )

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={buttonClasses}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <span className={cn(
          'flex items-center justify-center gap-2',
          loading ? 'opacity-0' : 'opacity-100',
          iconPosition === 'right' && 'flex-row-reverse'
        )}>
          {children}
        </span>
      </motion.button>
    )
  }
)

LuxuryButton.displayName = 'LuxuryButton'

export { LuxuryButton }
