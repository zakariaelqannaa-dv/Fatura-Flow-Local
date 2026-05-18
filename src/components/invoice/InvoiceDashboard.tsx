import { useState, useRef, useCallback, useMemo } from 'react'
import type { InvoiceStatus, Currency } from '@/types/invoice'
import { calculateTotals } from '@/types/invoice'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import { STATUS_OPTIONS } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

type SortField = 'invoiceNumber' | 'client' | 'createdAt' | 'total' | 'status'
type SortDir = 'asc' | 'desc'

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
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
    TRY: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£',
  }
  return `${symbols[currency] ?? currency} ${amount.toFixed(2)}`
}

export function InvoiceDashboard() {
  const invoices = useInvoiceStore((s) => s.invoices)
  const loadInvoice = useInvoiceStore((s) => s.loadInvoice)
  const createNewInvoice = useInvoiceStore((s) => s.createNewInvoice)
  const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice)
  const exportData = useInvoiceStore((s) => s.exportData)
  const importData = useInvoiceStore((s) => s.importData)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [deleteId, setDeleteId] = useState<string | null>(null)

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

  const filtered = useMemo(() => {
    let list = invoices

    if (statusFilter !== 'all') {
      list = list.filter((inv) => inv.status === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.client.name.toLowerCase().includes(q),
      )
    }

    list = [...list].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'client') {
        return a.client.name.localeCompare(b.client.name) * dir
      }
      if (sortField === 'total') {
        const ta = calculateTotals(a.lineItems, a.taxRate).total
        const tb = calculateTotals(b.lineItems, b.taxRate).total
        return (ta - tb) * dir
      }
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (aVal < bVal) return -1 * dir
      if (aVal > bVal) return 1 * dir
      return 0
    })

    return list
  }, [invoices, search, statusFilter, sortField, sortDir])

  const handleEdit = useCallback(
    (id: string) => {
      loadInvoice(id)
    },
    [loadInvoice],
  )

  const handleDeleteConfirm = useCallback(() => {
    if (deleteId) {
      deleteInvoice(deleteId)
      setDeleteId(null)
    }
  }, [deleteId, deleteInvoice])

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
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                Export Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Import Data
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <Button size="sm" onClick={createNewInvoice}>
                + New Invoice
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search by invoice # or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
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
            <p className="text-sm text-muted-foreground ml-auto">
              {filtered.length} of {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {invoices.length === 0
                ? 'No invoices yet. Create your first invoice!'
                : 'No invoices match your filters.'}
            </p>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('invoiceNumber')}
                    >
                      Invoice #
                      {sortField === 'invoiceNumber' && (
                        <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('client')}
                    >
                      Client
                      {sortField === 'client' && (
                        <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('createdAt')}
                    >
                      Date
                      {sortField === 'createdAt' && (
                        <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none text-right"
                      onClick={() => handleSort('total')}
                    >
                      Total
                      {sortField === 'total' && (
                        <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortField === 'status' && (
                        <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((inv) => {
                    const totals = calculateTotals(inv.lineItems, inv.taxRate)
                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">
                          {inv.invoiceNumber}
                        </TableCell>
                        <TableCell>{inv.client.name || '—'}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(inv.createdAt)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(totals.total, inv.currency)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[inv.status]}`}
                          >
                            {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleEdit(inv.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => setDeleteId(inv.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
