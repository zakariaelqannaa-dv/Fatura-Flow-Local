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
  blue: 'shadow-[0_0_20px_rgba(59,130,246,0.08)]',
  green: 'shadow-[0_0_20px_rgba(34,197,94,0.08)]',
  yellow: 'shadow-[0_0_20px_rgba(234,179,8,0.08)]',
  purple: 'shadow-[0_0_20px_rgba(168,85,247,0.08)]',
}

const accentBorder = {
  blue: 'border-blue-500/15',
  green: 'border-green-500/15',
  yellow: 'border-yellow-500/15',
  purple: 'border-purple-500/15',
}

const accentIcon = {
  blue: 'text-blue-300',
  green: 'text-green-300',
  yellow: 'text-yellow-300',
  purple: 'text-purple-300',
}

const accentIconBg = {
  blue: 'bg-blue-500/10',
  green: 'bg-green-500/10',
  yellow: 'bg-yellow-500/10',
  purple: 'bg-purple-500/10',
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
        'flex items-center gap-3 rounded-[22px] border bg-white/[0.03] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.05]',
        accentBorder[accent],
        accentGlow[accent],
        className,
      )}
    >
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-[12px]',
          accentIconBg[accent],
        )}
      >
        <Icon className={cn('size-4', accentIcon[accent])} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-white/40">{label}</p>
        <p className="truncate text-sm font-semibold text-white/85">{value}</p>
      </div>
    </div>
  )
}
