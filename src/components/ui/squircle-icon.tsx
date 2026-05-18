import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SquircleIconProps {
  icon: LucideIcon
  active?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SquircleIcon({
  icon: Icon,
  active = false,
  size = 'md',
  className,
}: SquircleIconProps) {
  const sizeMap = {
    sm: 'size-10 rounded-[12px]',
    md: 'size-12 rounded-[14px]',
    lg: 'size-16 rounded-[18px]',
  }

  const iconSizeMap = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  }

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        active
          ? 'bg-gradient-to-br from-white/15 to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.2)]'
          : 'bg-gradient-to-br from-white/10 to-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.15)]',
        sizeMap[size],
        'hover:scale-110 hover:from-white/20 hover:to-white/[0.06]',
        className,
      )}
    >
      <Icon
        className={cn(
          iconSizeMap[size],
          active ? 'text-white/90' : 'text-white/50',
          'transition-colors duration-200',
        )}
      />
      {active && (
        <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/60" />
      )}
    </div>
  )
}
