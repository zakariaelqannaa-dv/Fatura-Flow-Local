import { useMemo, useRef, useCallback } from 'react'
import { DollarSign, Receipt, TrendingUp, Clock, FileText, Download, Upload } from 'lucide-react'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import { useThemeStore } from '@/store/useThemeStore'
import { calculateTotals } from '@/types/invoice'
import type { Currency } from '@/types/invoice'
import { MacWindow } from '@/components/layout/MacWindow'
import { StatsCard } from '@/components/invoice/StatsCard'
import { Button } from '@/components/ui/button'

function formatShortCurrency(amount: number, currency: Currency): string {
  const sym: Record<string, string> = { MAD: 'DH', USD: '$', EUR: '€', GBP: '£' }
  const s = sym[currency] ?? currency
  if (amount >= 1_000_000) return `${s} ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${s} ${(amount / 1_000).toFixed(1)}K`
  return `${s} ${amount.toFixed(0)}`
}

const statusColors: Record<string, string> = {
  paid:      'bg-green-500/10 text-green-300/90 border-green-500/20',
  draft:     'bg-yellow-500/10 text-yellow-300/90 border-yellow-500/20',
  sent:      'bg-blue-500/10 text-blue-300/90 border-blue-500/20',
  cancelled: 'bg-white/[0.04] text-white/35 border-white/10',
}

export function DashboardView() {
  const invoices          = useInvoiceStore((s) => s.invoices)
  const createNewInvoice  = useInvoiceStore((s) => s.createNewInvoice)
  const exportData        = useInvoiceStore((s) => s.exportData)
  const importData        = useInvoiceStore((s) => s.importData)
  const loadInvoice       = useInvoiceStore((s) => s.loadInvoice)
  const primaryCurrency   = useThemeStore((s) => s.displayCurrency)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalRevenue = useMemo(() => {
    let sum = 0
    for (const inv of invoices) sum += calculateTotals(inv.lineItems, inv.taxRate).total
    return sum
  }, [invoices])

  const paidRevenue = useMemo(() => {
    let sum = 0
    for (const inv of invoices)
      if (inv.status === 'paid') sum += calculateTotals(inv.lineItems, inv.taxRate).total
    return sum
  }, [invoices])

  const draftCount = useMemo(() => invoices.filter((i) => i.status === 'draft').length, [invoices])

  const latestInvoices = useMemo(
    () =>
      [...invoices]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [invoices],
  )

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

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col">
      <MacWindow title="Fatura Flow — Overview" stretch>
        <div className="flex flex-col gap-6">

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatsCard icon={DollarSign} label="Total Revenue" value={formatShortCurrency(totalRevenue, primaryCurrency)} accent="blue" />
            <StatsCard icon={Receipt}    label="Total Invoices" value={String(invoices.length)}                             accent="purple" />
            <StatsCard icon={TrendingUp} label="Paid Revenue"   value={formatShortCurrency(paidRevenue, primaryCurrency)}  accent="green" />
            <StatsCard icon={Clock}      label="Drafts"          value={String(draftCount)}                                 accent="yellow" />
          </div>

          {invoices.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center gap-5 py-16 rounded-[24px] border border-white/[0.07] bg-white/[0.02]">
              <div className="flex size-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                <FileText className="size-6 text-white/35" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-white/55">No invoices yet</p>
                <p className="text-xs text-white/30">Create your first invoice to get started</p>
              </div>
              <Button onClick={createNewInvoice}>+ Create Your First Invoice</Button>
            </div>
          ) : (
            <>
              {/* Quick summary grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Total Invoices', value: String(invoices.length), color: 'text-white/88' },
                  { label: 'Paid Revenue',   value: `${paidRevenue.toFixed(0)} ${primaryCurrency}`, color: 'text-green-300/90' },
                  { label: 'Draft Count',    value: String(draftCount), color: 'text-yellow-300/90' },
                  { label: 'Latest Invoice', value: latestInvoices[0]?.invoiceNumber ?? '—', color: 'text-white/88' },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-[20px] border border-white/[0.08] bg-white/[0.025] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-white/35">{label}</p>
                    <p className={`text-lg font-semibold mt-1 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Recent invoices list */}
              {latestInvoices.length > 0 && (
                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                    Recent Invoices
                  </p>
                  <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.018] backdrop-blur-2xl">
                    {latestInvoices.map((inv, i) => {
                      const t = calculateTotals(inv.lineItems, inv.taxRate)
                      return (
                        <button
                          key={inv.id}
                          type="button"
                          onClick={() => loadInvoice(inv.id)}
                          className={[
                            'flex w-full items-center justify-between px-5 py-3.5 text-left text-sm',
                            'transition-colors duration-200 hover:bg-white/[0.04]',
                            i < latestInvoices.length - 1 ? 'border-b border-white/[0.05]' : '',
                          ].join(' ')}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-white/88">{inv.invoiceNumber}</p>
                            <p className="truncate text-xs text-white/38">{inv.client.name || 'No client'}</p>
                          </div>
                          <div className="ml-4 text-right shrink-0">
                            <p className="font-semibold text-white/88">
                              {inv.currency} {t.total.toFixed(2)}
                            </p>
                            <span
                              className={`glass-badge inline-block rounded-[9px] px-2 py-0.5 text-[10px] font-medium border ${statusColors[inv.status] ?? ''}`}
                            >
                              {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Data management strip */}
              <div className="flex items-center justify-between rounded-[20px] border border-white/[0.08] bg-white/[0.025] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">Data Management</p>
                  <p className="text-sm text-white/55 mt-0.5">Export your data as JSON or restore from backup</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="size-3.5" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="size-3.5" />
                    Import
                  </Button>
                  <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
                </div>
              </div>
            </>
          )}
        </div>
      </MacWindow>
    </div>
  )
}
