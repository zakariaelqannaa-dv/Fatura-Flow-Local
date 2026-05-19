import {
  LayoutDashboard,
  Receipt,
  Settings,
} from 'lucide-react'
import { GlassIcon } from '@/components/ui/glass-icon'

export type NavId = 'dashboard' | 'invoices' | 'settings'

const navItems: { id: NavId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'invoices',  label: 'Invoices',  icon: Receipt },
  { id: 'settings',  label: 'Settings',  icon: Settings },
]

interface SidebarProps {
  activeNav: NavId
  onNavChange: (id: NavId) => void
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="glass-panel fixed left-0 top-0 z-10 flex w-20 flex-col items-center border-r py-6 lg:w-64 lg:items-stretch lg:px-4 rounded-r-[32px]">
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center gap-3 lg:justify-start lg:px-2">
        <img
          src="/favicon.svg"
          alt="Fatura Flow"
          className="size-10 shrink-0 rounded-[14px] shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
        />
        <span className="hidden text-sm font-semibold tracking-tight text-white/82 lg:block">
          Fatura Flow
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1.5 lg:items-stretch w-full">
        {navItems.map((item) => {
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavChange(item.id)}
              className={[
                'flex flex-col items-center gap-1.5 spring rounded-[18px] px-2 py-2',
                'lg:flex-row lg:gap-3 lg:px-3 lg:py-2.5 w-full',
                isActive
                  ? 'bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'hover:bg-white/[0.035]',
              ].join(' ')}
            >
              <GlassIcon
                icon={item.icon}
                active={isActive}
                size="sm"
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-200 lg:text-sm ${
                  isActive ? 'text-white/85' : 'text-white/38'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
