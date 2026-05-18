import { useState, useEffect, useCallback, useRef } from 'react'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import { InvoiceForm } from '@/components/invoice/InvoiceForm'
import { InvoiceDashboard } from '@/components/invoice/InvoiceDashboard'
import { DashboardView } from '@/components/invoice/DashboardView'
import { AppLayout } from '@/components/layout/AppLayout'
import { MacWindow } from '@/components/layout/MacWindow'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'

function SettingsView() {
  const exportData = useInvoiceStore((s) => s.exportData)
  const importData = useInvoiceStore((s) => s.importData)
  const invoices = useInvoiceStore((s) => s.invoices)
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
          if (!result.success) {
            alert(`Import failed: ${result.error ?? 'Unknown error'}`)
          }
        }
      }
      reader.readAsText(file)
      e.target.value = ''
    },
    [importData],
  )

  return (
    <div className="mx-auto max-w-2xl">
      <MacWindow title="Fatura Flow — Settings">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-white/80">Data Management</p>
            <p className="mt-1 text-xs text-white/40">
              {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} stored in your browser.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.02] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <div>
              <p className="text-sm text-white/70">Export Data</p>
              <p className="text-xs text-white/40">Download all invoices as a JSON backup</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="size-3.5" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.02] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <div>
              <p className="text-sm text-white/70">Import Data</p>
              <p className="text-xs text-white/40">Restore invoices from a JSON backup</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
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
          </div>

          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.02] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <p className="text-sm text-white/70">About</p>
            <p className="mt-1 text-xs text-white/40">
              Fatura Flow Local v1.0 &mdash; 100% client-side invoice management.
              All data stays in your browser.
            </p>
          </div>
        </div>
      </MacWindow>
    </div>
  )
}

type View = 'dashboard' | 'invoices' | 'settings'

function App() {
  const loadInvoices = useInvoiceStore((s) => s.loadInvoices)
  const currentInvoice = useInvoiceStore((s) => s.currentInvoice)
  const [view, setView] = useState<View>('invoices')

  useEffect(() => {
    loadInvoices()
  }, [loadInvoices])

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
      {view === 'invoices' && <InvoiceDashboard />}
      {view === 'settings' && <SettingsView />}
    </AppLayout>
  )
}

export default App
