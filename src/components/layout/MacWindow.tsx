import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MacWindowProps {
  children: ReactNode
  title?: string
  className?: string
  stretch?: boolean
}

export function MacWindow({ children, title, className, stretch }: MacWindowProps) {
  return (
    <div
      className={cn(
        'mac-window overflow-hidden flex flex-col',
        stretch && 'flex-1 min-h-0',
        className,
      )}
    >
      {/* Title bar */}
      <div className="mac-window-header flex items-center gap-3 px-5 py-3.5 select-none shrink-0">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="traffic-light size-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.35),0_0_8px_rgba(255,95,87,0.4)] hover:brightness-110 cursor-default" />
          <div className="traffic-light size-3 rounded-full bg-[#febc2e] shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.35),0_0_8px_rgba(254,188,46,0.4)] hover:brightness-110 cursor-default" />
          <div className="traffic-light size-3 rounded-full bg-[#28c840] shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.35),0_0_8px_rgba(40,200,64,0.4)] hover:brightness-110 cursor-default" />
        </div>

        {/* Centered title */}
        {title && (
          <span className="absolute left-1/2 -translate-x-1/2 text-[11px] font-medium text-white/35 tracking-wide pointer-events-none">
            {title}
          </span>
        )}
      </div>

      {/* Content */}
      <div className={cn('p-6 animate-fade-blur-in', stretch && 'flex-1 overflow-y-auto')}>
        {children}
      </div>
    </div>
  )
}
