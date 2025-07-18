import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'processing' | 'warning' | 'standby'
  label: string
  icon: LucideIcon
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showText?: boolean
}

export function StatusIndicator({ 
  status, 
  label, 
  icon: Icon, 
  className,
  size = 'md',
  showLabel = true,
  showText = true
}: StatusIndicatorProps) {
  const statusColors = {
    online: 'bg-green-500 text-green-50 border-green-600',
    offline: 'bg-red-500 text-red-50 border-red-600',
    processing: 'bg-blue-500 text-blue-50 border-blue-600',
    warning: 'bg-amber-500 text-amber-50 border-amber-600',
    standby: 'bg-slate-500 text-slate-50 border-slate-600'
  }

  const statusDots = {
    online: 'bg-green-500 border-green-600 shadow-[0_0_8px_rgba(34,197,94,0.6)]',
    offline: 'bg-red-500 border-red-600',
    processing: 'bg-blue-500 border-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.6)]',
    warning: 'bg-amber-500 border-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    standby: 'bg-slate-500 border-slate-600'
  }

  const iconColors = {
    online: 'text-green-600',
    offline: 'text-red-600',
    processing: 'text-blue-600',
    warning: 'text-amber-600',
    standby: 'text-slate-600'
  }

  const statusText = {
    online: 'Online',
    offline: 'Offline',
    processing: 'Processing',
    warning: 'Warning',
    standby: 'Standby'
  }

  const sizes = {
    sm: {
      icon: 'w-4 h-4',
      dot: 'w-2 h-2 -top-0.5 -right-0.5 border',
      text: 'text-xs',
      badge: 'text-[10px] px-1.5 py-0.5'
    },
    md: {
      icon: 'w-6 h-6',
      dot: 'w-3 h-3 -top-1 -right-1 border-2',
      text: 'text-xs',
      badge: 'text-xs px-2 py-0.5'
    },
    lg: {
      icon: 'w-8 h-8',
      dot: 'w-4 h-4 -top-1 -right-1 border-2',
      text: 'text-sm',
      badge: 'text-xs px-2 py-1'
    }
  }

  const pulseAnimation = status === 'processing' || status === 'warning';

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="relative">
        <Icon className={cn(
          sizes[size].icon,
          iconColors[status]
        )} />
        
        {pulseAnimation ? (
          <motion.div
            className={cn(
              'absolute rounded-full border',
              statusDots[status],
              sizes[size].dot
            )}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ) : (
          <div className={cn(
            'absolute rounded-full border',
            statusDots[status],
            sizes[size].dot
          )} />
        )}
      </div>
      
      {(showLabel || showText) && (
        <div className="flex flex-col">
          {showLabel && (
            <span className={cn(
              'font-medium text-slate-600',
              sizes[size].text
            )}>
              {label}
            </span>
          )}
          
          {showText && (
            <div className={cn(
              'rounded-full font-medium border',
              statusColors[status],
              sizes[size].badge
            )}>
              {statusText[status]}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
