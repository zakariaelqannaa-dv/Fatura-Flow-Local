import {
  LayoutDashboard,
  Receipt,
  FileText,
  Settings,
  Plus,
} from 'lucide-react'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import { SquircleIcon } from '@/components/ui/squircle-icon'

export type NavId = 'dashboard' | 'invoices' | 'settings'

const navItems: { id: NavId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  activeNav: NavId
  onNavChange: (id: NavId) => void
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const createNewInvoice = useInvoiceStore((s) => s.createNewInvoice)

  return (
    <aside className="glass-panel fixed left-0 top-0 z-10 flex h-dvh w-20 flex-col items-center border-r py-5 lg:w-64 lg:items-stretch lg:px-4">
      <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start lg:px-1">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-white/15 to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
          <FileText className="size-5 text-white/80" />
        </div>
        <span className="hidden text-sm font-semibold tracking-tight text-white/80 lg:block">
          Fatura Flow
        </span>
      </div>

      <nav className="flex flex-col items-center gap-3 lg:items-stretch">
        {navItems.map((item) => {
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavChange(item.id)}
              className="flex flex-col items-center gap-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 lg:flex-row lg:gap-3"
            >
              <SquircleIcon
                icon={item.icon}
                active={isActive}
                size="sm"
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-200 lg:text-sm ${
                  isActive ? 'text-white/80' : 'text-white/40'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-3 lg:items-stretch">
        <button
          type="button"
          onClick={createNewInvoice}
          className="mt-2 hidden w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-br from-white/12 to-white/[0.04] px-3 py-2.5 text-sm text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:from-white/18 hover:to-white/[0.06] active:translate-y-px lg:flex"
        >
          <Plus className="size-4" />
          New Invoice
        </button>

        <button
          type="button"
          onClick={createNewInvoice}
          className="mt-2 flex size-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-white/12 to-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 hover:from-white/18 hover:to-white/[0.06] active:translate-y-px lg:hidden"
        >
          <Plus className="size-4 text-white/70" />
        </button>
      </div>
    </aside>
  )
}
