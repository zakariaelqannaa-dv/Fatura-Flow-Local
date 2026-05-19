import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MacWindowProps {
  children: ReactNode
  title?: string
  className?: string
  stretch?: boolean
  onClose?: () => void
}

export function MacWindow({ children, title, className, stretch, onClose }: MacWindowProps) {
  const [isClosed, setIsClosed] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setIsClosed(true)
    }
  }

  // Beautiful local restore state if closed without custom onClose
  if (isClosed) {
    return (
      <div className="flex items-center justify-center py-16 animate-fade-blur-in">
        <button
          onClick={() => setIsClosed(false)}
          className="group relative flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 py-4 text-xs font-semibold text-white/85 shadow-[0_24px_80px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/[0.15] spring-bounce cursor-pointer active:scale-95"
        >
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.3)]" />
            <div className="size-2.5 rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.3)]" />
            <div className="size-2.5 rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.3)]" />
          </div>
          <span className="text-white/60 group-hover:text-white spring-fast">
            Open {title || 'Window'}
          </span>
        </button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'mac-window flex flex-col transition-all duration-500 ease-out',
        isMaximized 
          ? 'fixed inset-4 z-[99] max-w-none shadow-[0_60px_160px_rgba(0,0,0,0.6)] border border-white/10 backdrop-blur-3xl' 
          : 'relative overflow-hidden',
        !isMinimized && stretch && 'flex-1 min-h-0',
        isMinimized && 'shadow-md border border-white/5',
        className,
      )}
    >
      {/* Title bar (Double click to toggle minimize) */}
      <div 
        onDoubleClick={() => setIsMinimized(!isMinimized)}
        className="mac-window-header flex items-center justify-between px-5 py-3.5 select-none shrink-0 cursor-pointer active:brightness-95 transition-all duration-300"
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 group/lights relative z-10">
          <button
            onClick={handleClose}
            className="traffic-light size-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.35),0_0_8px_rgba(255,95,87,0.4)] hover:brightness-110 flex items-center justify-center text-[7px] font-black text-black/0 group-hover/lights:text-black/60 cursor-pointer spring-fast border-0 p-0"
            title="Close"
            aria-label="Close window"
          >
            ×
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="traffic-light size-3 rounded-full bg-[#febc2e] shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.35),0_0_8px_rgba(254,188,46,0.4)] hover:brightness-110 flex items-center justify-center text-[8px] font-black text-black/0 group-hover/lights:text-black/60 cursor-pointer spring-fast border-0 p-0"
            title="Minimize"
            aria-label="Minimize window"
          >
            −
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="traffic-light size-3 rounded-full bg-[#28c840] shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.35),0_0_8px_rgba(40,200,64,0.4)] hover:brightness-110 flex items-center justify-center text-[6px] font-black text-black/0 group-hover/lights:text-black/60 cursor-pointer spring-fast border-0 p-0"
            title={isMaximized ? "Restore Size" : "Maximize"}
            aria-label="Maximize window"
          >
            ＋
          </button>
        </div>

        {/* Centered title */}
        {title && (
          <span className="absolute left-1/2 -translate-x-1/2 text-[11px] font-medium text-white/35 tracking-wide pointer-events-none">
            {title} {isMinimized && <span className="opacity-60">(Minimized)</span>}
          </span>
        )}

        {/* Placeholder to balance out traffic lights on the right */}
        <div className="w-12 h-3" />
      </div>

      {/* Content */}
      <div 
        className={cn(
          'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isMinimized 
            ? 'h-0 p-0 opacity-0 pointer-events-none overflow-hidden' 
            : 'p-6 opacity-100',
          !isMinimized && stretch && 'flex-1 overflow-y-auto'
        )}
      >
        {children}
      </div>
    </div>
  )
}
