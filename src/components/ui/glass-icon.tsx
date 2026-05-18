import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GlassIconProps {
  icon: LucideIcon
  active?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function GlassIcon({
  icon: Icon,
  active = false,
  size = 'md',
  className,
}: GlassIconProps) {
  const sizeMap = {
    xs: 'size-8  rounded-[14px]',
    sm: 'size-10 rounded-[18px]',
    md: 'size-12 rounded-[20px]',
    lg: 'size-16 rounded-[24px]',
  }

  const iconSizeMap = {
    xs: 'size-3.5',
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  }

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center',
        'spring-bounce',
        // active vs inactive glass
        active
          ? [
              'border border-white/12',
              'bg-gradient-to-br from-white/18 to-white/[0.06]',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_6px_20px_rgba(255,255,255,0.07),0_4px_12px_rgba(0,0,0,0.22)]',
            ]
          : [
              'border border-white/[0.08]',
              'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.18)]',
            ],
        sizeMap[size],
        // hover
        'hover:scale-[1.08]',
        'hover:from-white/22 hover:to-white/[0.08]',
        'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_24px_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.24)]',
        className,
      )}
    >
      <Icon
        className={cn(
          iconSizeMap[size],
          active ? 'text-white/92' : 'text-white/48',
          'transition-colors duration-200',
        )}
      />
      {active && (
        <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/65 shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
      )}
    </div>
  )
}
