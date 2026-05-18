import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string
  accent?: 'blue' | 'green' | 'yellow' | 'purple'
  className?: string
}

const accentGlow = {
  blue:   'hover:shadow-[0_0_0_1px_rgba(59,130,246,0.14),0_16px_48px_rgba(59,130,246,0.1)]',
  green:  'hover:shadow-[0_0_0_1px_rgba(34,197,94,0.14),0_16px_48px_rgba(34,197,94,0.1)]',
  yellow: 'hover:shadow-[0_0_0_1px_rgba(234,179,8,0.14),0_16px_48px_rgba(234,179,8,0.1)]',
  purple: 'hover:shadow-[0_0_0_1px_rgba(168,85,247,0.14),0_16px_48px_rgba(168,85,247,0.1)]',
}

const accentBorder = {
  blue:   'border-blue-500/[0.14]',
  green:  'border-green-500/[0.14]',
  yellow: 'border-yellow-500/[0.14]',
  purple: 'border-purple-500/[0.14]',
}

const accentIcon = {
  blue:   'text-blue-300/90',
  green:  'text-green-300/90',
  yellow: 'text-yellow-300/90',
  purple: 'text-purple-300/90',
}

const accentIconBg = {
  blue:   'bg-blue-500/[0.12]   border-blue-500/[0.16]',
  green:  'bg-green-500/[0.12]  border-green-500/[0.16]',
  yellow: 'bg-yellow-500/[0.12] border-yellow-500/[0.16]',
  purple: 'bg-purple-500/[0.12] border-purple-500/[0.16]',
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  accent = 'blue',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        // shape + glass
        'flex items-center gap-3.5 rounded-[24px] border px-4 py-4',
        'bg-white/[0.028] backdrop-blur-xl',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_8px_24px_rgba(0,0,0,0.1)]',
        // animation
        'spring hover:-translate-y-0.5 hover:bg-white/[0.045]',
        'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_48px_rgba(0,0,0,0.14)]',
        accentBorder[accent],
        accentGlow[accent],
        className,
      )}
    >
      {/* Icon pill */}
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-[16px] border',
          accentIconBg[accent],
        )}
      >
        <Icon className={cn('size-4', accentIcon[accent])} />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-white/38">{label}</p>
        <p className="truncate text-base font-semibold text-white/88 mt-0.5">{value}</p>
      </div>
    </div>
  )
}
