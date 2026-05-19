import { useState, useEffect, useCallback, useRef } from 'react'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import { useThemeStore } from '@/store/useThemeStore'
import { InvoiceForm } from '@/components/invoice/InvoiceForm'
import { InvoiceDashboard } from '@/components/invoice/InvoiceDashboard'
import { DashboardView } from '@/components/invoice/DashboardView'
import { AppLayout } from '@/components/layout/AppLayout'
import { MacWindow } from '@/components/layout/MacWindow'
import { Button } from '@/components/ui/button'
import { CURRENCY_OPTIONS } from '@/constants'
import { Download, Upload, Info, Moon, Sun, Monitor } from 'lucide-react'

function SettingsView() {
  const exportData = useInvoiceStore((s) => s.exportData)
  const importData = useInvoiceStore((s) => s.importData)
  const invoices   = useInvoiceStore((s) => s.invoices)
  const themeState = useThemeStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = useCallback(() => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fatura-flow-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [exportData])

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result
        if (typeof text === 'string') {
          const result = importData(text)
          if (!result.success) alert(`Import failed: ${result.error ?? 'Unknown error'}`)
        }
      }
      reader.readAsText(file)
      e.target.value = ''
    },
    [importData],
  )

  const Row = ({
    title,
    description,
    action,
  }: {
    title: string
    description: string
    action: React.ReactNode
  }) => (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[20px] border border-white/[0.08] bg-white/[0.025] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      <div>
        <p className="text-sm font-medium text-foreground/80">{title}</p>
        <p className="text-xs text-foreground/40 mt-0.5">{description}</p>
      </div>
      {action}
    </div>
  )

  const themeOptions = [
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
  ] as const

  return (
    <div className="mx-auto max-w-2xl">
      <MacWindow title="Fatura Flow — Settings">
        <div className="space-y-4">
          {/* Header */}
          <div className="mb-2">
            <p className="text-sm font-semibold text-foreground/80">Preferences</p>
          </div>

          {/* Theme */}
          <Row
            title="Appearance"
            description="Switch between light, dark, or system default"
            action={
              <div className="flex items-center rounded-[14px] bg-black/10 dark:bg-black/20 p-1 shadow-inner ring-1 ring-white/10 dark:ring-white/5">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon
                  const isActive = themeState.theme === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => themeState.setTheme(opt.id)}
                      className={[
                        'relative flex items-center justify-center gap-2 rounded-[10px] px-3.5 py-1.5 text-xs font-medium transition-all duration-300',
                        isActive 
                          ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-black dark:bg-white/15 dark:text-white dark:shadow-[0_2px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]'
                          : 'text-slate-500 hover:text-slate-800 dark:text-white/40 dark:hover:text-white/70 hover:bg-white/5',
                      ].join(' ')}
                    >
                      <Icon className="size-3.5" />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            }
          />

          {/* Currency */}
          <Row
            title="Currency"
            description="Display currency for dashboard revenue stats"
            action={
              <div className="flex items-center rounded-[14px] bg-black/10 dark:bg-black/20 p-1 shadow-inner ring-1 ring-white/10 dark:ring-white/5">
                {CURRENCY_OPTIONS.map((c) => {
                  const isActive = themeState.displayCurrency === c
                  return (
                    <button
                      key={c}
                      onClick={() => themeState.setDisplayCurrency(c)}
                      className={[
                        'relative flex items-center justify-center gap-2 rounded-[10px] px-3.5 py-1.5 text-xs font-medium transition-all duration-300',
                        isActive 
                          ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-black dark:bg-white/15 dark:text-white dark:shadow-[0_2px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]'
                          : 'text-slate-500 hover:text-slate-800 dark:text-white/40 dark:hover:text-white/70 hover:bg-white/5',
                      ].join(' ')}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
            }
          />

          <div className="mt-8 mb-2">
            <p className="text-sm font-semibold text-foreground/80">Data Management</p>
            <p className="text-xs text-foreground/40 mt-0.5">
              {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} stored locally in your browser.
            </p>
          </div>

          {/* Export */}
          <Row
            title="Export Data"
            description="Download all invoices as a JSON backup file"
            action={
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="size-3.5" />
                Export
              </Button>
            }
          />

          {/* Import */}
          <Row
            title="Import Data"
            description="Restore invoices from a previously exported JSON backup"
            action={
              <>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="size-3.5" />
                  Import
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
              </>
            }
          />

          {/* About */}
          <div className="flex items-start gap-3 rounded-[20px] border border-white/[0.06] bg-white/[0.015] px-5 py-4 mt-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <Info className="size-4 text-foreground/30 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground/70">About Fatura Flow Local</p>
              <p className="text-xs text-foreground/40 mt-1 leading-relaxed">
                Version 1.0 &mdash; 100% client-side invoice management.
                All data is stored in your browser&apos;s localStorage and never leaves your device.
              </p>
            </div>
          </div>
        </div>
      </MacWindow>
    </div>
  )
}

type View = 'dashboard' | 'invoices' | 'settings'

function App() {
  const loadInvoices    = useInvoiceStore((s) => s.loadInvoices)
  const currentInvoice  = useInvoiceStore((s) => s.currentInvoice)
  const [view, setView] = useState<View>('invoices')

  useEffect(() => { loadInvoices() }, [loadInvoices])

  if (currentInvoice) {
    return (
      <AppLayout activeNav="invoices" onNavChange={() => {}}>
        <InvoiceForm />
      </AppLayout>
    )
  }

  return (
    <AppLayout activeNav={view} onNavChange={setView}>
      {view === 'dashboard' && <DashboardView />}
      {view === 'invoices'  && <InvoiceDashboard />}
      {view === 'settings'  && <SettingsView />}
    </AppLayout>
  )
}

export default App
