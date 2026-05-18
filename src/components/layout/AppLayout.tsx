import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import type { NavId } from './Sidebar'

interface AppLayoutProps {
  children: ReactNode
  activeNav?: NavId
  onNavChange?: (id: NavId) => void
}

export function AppLayout({
  children,
  activeNav = 'invoices',
  onNavChange,
}: AppLayoutProps) {
  return (
    <div className="relative min-h-dvh">
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange ?? (() => {})}
      />
      <main className="relative z-20 ml-20 min-h-dvh p-4 lg:ml-64 lg:p-8">
        {children}
      </main>
    </div>
  )
}
