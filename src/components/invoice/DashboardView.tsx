import { useMemo, useRef, useCallback } from 'react'
import { DollarSign, Receipt, TrendingUp, Clock, FileText, Download, Upload } from 'lucide-react'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import { calculateTotals } from '@/types/invoice'
import type { Currency } from '@/types/invoice'
import { MacWindow } from '@/components/layout/MacWindow'
import { StatsCard } from '@/components/invoice/StatsCard'
import { Button } from '@/components/ui/button'

function formatShortCurrency(amount: number, currency: Currency): string {
  const sym: Record<string, string> = { TRY: '₺', USD: '$', EUR: '€', GBP: '£' }
  const s = sym[currency] ?? currency
  if (amount >= 1_000_000) return `${s} ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${s} ${(amount / 1_000).toFixed(1)}K`
  return `${s} ${amount.toFixed(0)}`
}

export function DashboardView() {
  const invoices = useInvoiceStore((s) => s.invoices)
  const createNewInvoice = useInvoiceStore((s) => s.createNewInvoice)
  const exportData = useInvoiceStore((s) => s.exportData)
  const importData = useInvoiceStore((s) => s.importData)
  const loadInvoice = useInvoiceStore((s) => s.loadInvoice)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalRevenue = useMemo(() => {
    let sum = 0
    for (const inv of invoices) {
      sum += calculateTotals(inv.lineItems, inv.taxRate).total
    }
    return sum
  }, [invoices])

  const paidRevenue = useMemo(() => {
    let sum = 0
    for (const inv of invoices) {
      if (inv.status === 'paid') {
        sum += calculateTotals(inv.lineItems, inv.taxRate).total
      }
    }
    return sum
  }, [invoices])

  const draftCount = useMemo(
    () => invoices.filter((i) => i.status === 'draft').length,
    [invoices],
  )

  const primaryCurrency: Currency =
    invoices.length > 0 ? invoices[0]!.currency : 'TRY'

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
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatShortCurrency(totalRevenue, primaryCurrency)}
          accent="blue"
        />
        <StatsCard
          icon={Receipt}
          label="Total Invoices"
          value={String(invoices.length)}
          accent="purple"
        />
        <StatsCard
          icon={TrendingUp}
          label="Paid"
          value={formatShortCurrency(paidRevenue, primaryCurrency)}
          accent="green"
        />
        <StatsCard
          icon={Clock}
          label="Drafts"
          value={String(draftCount)}
          accent="yellow"
        />
      </div>

      <MacWindow title="Fatura Flow — Overview">
        <div className="space-y-6">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="flex size-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-white/10 to-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                <FileText className="size-6 text-white/40" />
              </div>
              <p className="text-sm text-white/40">No invoices yet</p>
              <Button onClick={createNewInvoice}>+ Create Your First Invoice</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.02] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <p className="text-xs text-white/40">Total Invoices</p>
                  <p className="text-lg font-semibold text-white/85">{invoices.length}</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.02] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <p className="text-xs text-white/40">Paid</p>
                  <p className="text-lg font-semibold text-green-300">{paidRevenue.toFixed(0)} {primaryCurrency}</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.02] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <p className="text-xs text-white/40">Draft</p>
                  <p className="text-lg font-semibold text-yellow-300">{draftCount}</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.02] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <p className="text-xs text-white/40">Latest Invoice</p>
                  <p className="text-lg font-semibold text-white/85">
                    {latestInvoices[0]?.invoiceNumber ?? '—'}
                  </p>
                </div>
              </div>

              {latestInvoices.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-white/40">Recent Invoices</p>
                  <div className="overflow-hidden rounded-[14px] border border-white/10">
                    {latestInvoices.map((inv, i) => {
                      const t = calculateTotals(inv.lineItems, inv.taxRate)
                      return (
                        <button
                          key={inv.id}
                          type="button"
                          onClick={() => loadInvoice(inv.id)}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-white/[0.03] ${
                            i < latestInvoices.length - 1 ? 'border-b border-white/5' : ''
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-white/85">
                              {inv.invoiceNumber}
                            </p>
                            <p className="truncate text-xs text-white/40">
                              {inv.client.name || 'No client'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-white/85">
                              {inv.currency} {t.total.toFixed(2)}
                            </p>
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                inv.status === 'paid'
                                  ? 'bg-green-500/10 text-green-300'
                                  : inv.status === 'draft'
                                    ? 'bg-yellow-500/10 text-yellow-300'
                                    : inv.status === 'sent'
                                      ? 'bg-blue-500/10 text-blue-300'
                                      : 'bg-white/5 text-white/40'
                              }`}
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

              <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.02] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                <div>
                  <p className="text-xs text-white/40">Data Management</p>
                  <p className="text-sm text-white/60">
                    Export your data as JSON or restore from a backup
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="size-3.5" />
                    Export
                  </Button>
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
              </div>
            </>
          )}
        </div>
      </MacWindow>
    </div>
  )
}
