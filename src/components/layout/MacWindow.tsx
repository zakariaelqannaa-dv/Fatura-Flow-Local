import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MacWindowProps {
  children: ReactNode
  title?: string
  className?: string
}

export function MacWindow({ children, title, className }: MacWindowProps) {
  return (
    <div className={cn('mac-window overflow-hidden', className)}>
      <div className="mac-window-header flex items-center gap-2 px-4 py-3 select-none">
        <div className="flex items-center gap-1.5">
          <div className="traffic-light size-3 rounded-full bg-red-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_6px_rgba(239,68,68,0.3)] hover:bg-red-400" />
          <div className="traffic-light size-3 rounded-full bg-yellow-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_6px_rgba(234,179,8,0.3)] hover:bg-yellow-400" />
          <div className="traffic-light size-3 rounded-full bg-green-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_6px_rgba(34,197,94,0.3)] hover:bg-green-400" />
        </div>
        {title && (
          <span className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-white/40">
            {title}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
