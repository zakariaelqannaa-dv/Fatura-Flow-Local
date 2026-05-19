import { useState, useRef, useCallback, useMemo } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import type { InvoiceStatus, Currency, Invoice } from '@/types/invoice'
import { calculateTotals } from '@/types/invoice'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import { useThemeStore } from '@/store/useThemeStore'
import { STATUS_OPTIONS } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MacWindow } from '@/components/layout/MacWindow'
import { StatsCard } from '@/components/invoice/StatsCard'
import { InvoicePreview } from '@/components/invoice/InvoicePreview'
import { generateInvoicePdf } from '@/lib/pdf'
import { DollarSign, Receipt, Clock, TrendingUp, Search, FileDown } from 'lucide-react'

type SortField = 'invoiceNumber' | 'client' | 'createdAt' | 'total' | 'status'
type SortDir = 'asc' | 'desc'

const statusStyles: Record<InvoiceStatus, string> = {
  draft:
    'bg-yellow-500/10 text-yellow-300/90 border-yellow-500/20 shadow-[0_0_14px_rgba(234,179,8,0.1)]',
  sent:
    'bg-blue-500/10 text-blue-300/90 border-blue-500/20 shadow-[0_0_14px_rgba(59,130,246,0.1)]',
  paid:
    'bg-green-500/10 text-green-300/90 border-green-500/20 shadow-[0_0_14px_rgba(34,197,94,0.1)]',
  cancelled:
    'bg-white/[0.04] text-white/35 border-white/10',
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<string, string> = {
    MAD: 'DH', USD: '$', EUR: '€', GBP: '£',
  }
  return `${symbols[currency] ?? currency} ${amount.toFixed(2)}`
}

function formatShortCurrency(amount: number, currency: Currency): string {
  const sym: Record<string, string> = { MAD: 'DH', USD: '$', EUR: '€', GBP: '£' }
  const s = sym[currency] ?? currency
  if (amount >= 1_000_000) return `${s} ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${s} ${(amount / 1_000).toFixed(1)}K`
  return `${s} ${amount.toFixed(0)}`
}

export function InvoiceDashboard() {
  const invoices      = useInvoiceStore((s) => s.invoices)
  const loadInvoice   = useInvoiceStore((s) => s.loadInvoice)
  const createNewInvoice = useInvoiceStore((s) => s.createNewInvoice)
  const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice)
  const importData    = useInvoiceStore((s) => s.importData)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField]     = useState<SortField>('createdAt')
  const [sortDir, setSortDir]         = useState<SortDir>('desc')
  const [deleteId, setDeleteId]       = useState<string | null>(null)

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortField(field)
        setSortDir('asc')
      }
    },
    [sortField],
  )

  const handleEdit = useCallback((id: string) => { loadInvoice(id) }, [loadInvoice])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteId) { deleteInvoice(deleteId); setDeleteId(null) }
  }, [deleteId, deleteInvoice])

  const handleDownloadPdf = useCallback(async (inv: Invoice) => {
    const temp = document.createElement('div')
    temp.style.position = 'fixed'
    temp.style.left = '-9999px'
    temp.style.top = '0'
    document.body.appendChild(temp)

    const root = createRoot(temp)
    flushSync(() => root.render(<InvoicePreview invoice={inv} />))

    await new Promise((resolve) => setTimeout(resolve, 150))

    try {
      await generateInvoicePdf(temp, {
        filename: `${inv.invoiceNumber}.pdf`,
      })
    } finally {
      root.unmount()
      document.body.removeChild(temp)
    }
  }, [])

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

  const primaryCurrency = useThemeStore((s) => s.displayCurrency)

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

  const SortArrow = ({ field }: { field: SortField }) =>
    sortField === field ? (
      <span className="ml-1 text-white/35 text-[10px]">{sortDir === 'asc' ? '▲' : '▼'}</span>
    ) : null

  const filtered = useMemo(() => {
    let result = invoices

    if (statusFilter !== 'all') {
      result = result.filter((i) => i.status === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.client.name.toLowerCase().includes(q) ||
          i.client.email?.toLowerCase().includes(q)
      )
    }

    result = [...result].sort((a, b) => {
      let valA: any
      let valB: any

      switch (sortField) {
        case 'invoiceNumber':
          valA = a.invoiceNumber
          valB = b.invoiceNumber
          break
        case 'client':
          valA = a.client.name
          valB = b.client.name
          break
        case 'createdAt':
          valA = new Date(a.createdAt).getTime()
          valB = new Date(b.createdAt).getTime()
          break
        case 'total':
          valA = calculateTotals(a.lineItems, a.taxRate).total
          valB = calculateTotals(b.lineItems, b.taxRate).total
          break
        case 'status':
          valA = a.status
          valB = b.status
          break
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [invoices, search, statusFilter, sortField, sortDir])

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col">
      <MacWindow title="Fatura Flow — Invoices" stretch>
        <div className="flex flex-col gap-6">

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatsCard icon={DollarSign} label="Total Revenue" value={formatShortCurrency(totalRevenue, primaryCurrency)} accent="blue" />
            <StatsCard icon={Receipt}    label="Total Invoices" value={String(invoices.length)}                             accent="purple" />
            <StatsCard icon={TrendingUp} label="Paid Revenue"   value={formatShortCurrency(paidRevenue, primaryCurrency)}  accent="green" />
            <StatsCard icon={Clock}      label="Drafts"          value={String(draftCount)}                                 accent="yellow" />
          </div>

          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search + filter */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30 pointer-events-none" />
                  <Input
                    placeholder="Search invoice or client…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 max-w-xs"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Import</Button>
                <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
                <Button size="sm" onClick={createNewInvoice}>+ New Invoice</Button>
              </div>
            </div>

            {/* Count */}
            <p className="text-[11px] text-white/28 tracking-wide">
              {filtered.length} of {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
            </p>

            {/* Table or empty state */}
            {filtered.length === 0 ? (
              <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] py-16 text-center">
                <p className="text-sm text-white/35">
                  {invoices.length === 0
                    ? 'No invoices yet — create your first one!'
                    : 'No invoices match your filters.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('invoiceNumber')}>
                      Invoice # <SortArrow field="invoiceNumber" />
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('client')}>
                      Client <SortArrow field="client" />
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                      Date <SortArrow field="createdAt" />
                    </TableHead>
                    <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('total')}>
                      Total <SortArrow field="total" />
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                      Status <SortArrow field="status" />
                    </TableHead>
                    <TableHead className="w-36">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((inv) => {
                    const totals = calculateTotals(inv.lineItems, inv.taxRate)
                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="font-semibold text-white/88">{inv.invoiceNumber}</TableCell>
                        <TableCell className="text-white/65">{inv.client.name || '—'}</TableCell>
                        <TableCell className="text-white/40">{formatDate(inv.createdAt)}</TableCell>
                        <TableCell className="text-right font-semibold text-white/88">
                          {formatCurrency(totals.total, inv.currency)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`glass-badge inline-block rounded-[10px] px-2.5 py-1 text-[11px] font-medium tracking-wide ${statusStyles[inv.status]}`}
                          >
                            {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="xs" onClick={() => handleDownloadPdf(inv)} title="Download PDF">
                              <FileDown className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="xs" onClick={() => handleEdit(inv.id)}>Edit</Button>
                            <Button variant="ghost" size="xs" onClick={() => setDeleteId(inv.id)}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </MacWindow>

      {/* Delete confirm modal */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
