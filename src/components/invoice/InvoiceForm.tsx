import { useCallback, useRef, useState } from 'react'
import type { Invoice, LineItem } from '@/types/invoice'
import { calculateTotals } from '@/types/invoice'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import { CURRENCY_OPTIONS, STATUS_OPTIONS } from '@/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { MacWindow } from '@/components/layout/MacWindow'
import { InvoicePreview } from '@/components/invoice/InvoicePreview'
import { generateInvoicePdf } from '@/lib/pdf'
import { Trash2 } from 'lucide-react'

function LineItemRow({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: LineItem
  index: number
  onUpdate: (index: number, field: keyof LineItem, value: string | number) => void
  onRemove: (index: number) => void
}) {
  const rowTotal = item.quantity * item.unitPrice

  return (
    <div className="grid grid-cols-[1fr_72px_96px_88px_36px] gap-2 items-center">
      <div>
        <Label htmlFor={`desc-${item.id}`} className="sr-only">Description</Label>
        <Input
          id={`desc-${item.id}`}
          placeholder="Description"
          value={item.description}
          onChange={(e) => onUpdate(index, 'description', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`qty-${item.id}`} className="sr-only">Quantity</Label>
        <Input
          id={`qty-${item.id}`}
          type="number"
          min={0}
          step={1}
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) => onUpdate(index, 'quantity', Number(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor={`price-${item.id}`} className="sr-only">Unit Price</Label>
        <Input
          id={`price-${item.id}`}
          type="number"
          min={0}
          step={0.01}
          placeholder="Price"
          value={item.unitPrice}
          onChange={(e) => onUpdate(index, 'unitPrice', Number(e.target.value))}
        />
      </div>
      {/* Row total */}
      <div className="flex items-center justify-end h-9 text-sm font-medium text-white/55 pr-1">
        {rowTotal.toFixed(2)}
      </div>
      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label="Remove line item"
        className="flex items-center justify-center size-9 rounded-[16px] text-white/30 hover:text-red-300/80 hover:bg-red-500/10 spring"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  )
}

export function InvoiceForm() {
  const currentInvoice       = useInvoiceStore((s) => s.currentInvoice)
  const updateCurrentInvoice = useInvoiceStore((s) => s.updateCurrentInvoice)
  const saveCurrentInvoice   = useInvoiceStore((s) => s.saveCurrentInvoice)
  const createNewInvoice     = useInvoiceStore((s) => s.createNewInvoice)
  const setCurrentInvoice    = useInvoiceStore((s) => s.setCurrentInvoice)

  const pdfPreviewRef = useRef<HTMLDivElement>(null)
  const [showPdfPreview, setShowPdfPreview] = useState(false)

  if (!currentInvoice) return null

  const totals = calculateTotals(currentInvoice.lineItems, currentInvoice.taxRate)

  const handleFieldUpdate = useCallback(
    <K extends keyof Invoice>(field: K, value: Invoice[K]) => {
      updateCurrentInvoice({ [field]: value })
    },
    [updateCurrentInvoice],
  )

  const handleSenderUpdate = useCallback(
    <K extends keyof Invoice['sender']>(field: K, value: string) => {
      updateCurrentInvoice({ sender: { ...currentInvoice.sender, [field]: value } })
    },
    [updateCurrentInvoice, currentInvoice.sender],
  )

  const handleClientUpdate = useCallback(
    <K extends keyof Invoice['client']>(field: K, value: string) => {
      updateCurrentInvoice({ client: { ...currentInvoice.client, [field]: value } })
    },
    [updateCurrentInvoice, currentInvoice.client],
  )

  const handleLineItemUpdate = useCallback(
    (index: number, field: keyof LineItem, value: string | number) => {
      const items = currentInvoice.lineItems.map((item, i) => {
        if (i !== index) return item
        if (field === 'quantity' || field === 'unitPrice') return { ...item, [field]: value as number }
        return { ...item, [field]: value as string }
      })
      updateCurrentInvoice({ lineItems: items })
    },
    [updateCurrentInvoice, currentInvoice.lineItems],
  )

  const addLineItem = useCallback(() => {
    const newItem: LineItem = { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 }
    updateCurrentInvoice({ lineItems: [...currentInvoice.lineItems, newItem] })
  }, [updateCurrentInvoice, currentInvoice.lineItems])

  const removeLineItem = useCallback(
    (index: number) => {
      if (currentInvoice.lineItems.length <= 1) return
      const items = currentInvoice.lineItems.filter((_, i) => i !== index)
      updateCurrentInvoice({ lineItems: items })
    },
    [updateCurrentInvoice, currentInvoice.lineItems],
  )

  const handleSave = useCallback(() => {
    saveCurrentInvoice()
    createNewInvoice()
  }, [saveCurrentInvoice, createNewInvoice])

  const handleCancel = useCallback(() => { setCurrentInvoice(null) }, [setCurrentInvoice])

  const handleDownloadPdf = useCallback(async () => {
    if (!pdfPreviewRef.current) return

    // Capture from a detached clone to avoid Tailwind v4 oklab color values
    // in the dialog's CSS cascade (html2canvas does not support oklab/oklch).
    const clone = document.createElement('div')
    clone.style.cssText =
      'position:fixed;left:-9999px;top:0;background:#fff;color:#111827;' +
      "font-family:'Inter','Geist',system-ui,sans-serif;"
    clone.innerHTML = pdfPreviewRef.current.innerHTML
    document.body.appendChild(clone)

    try {
      await generateInvoicePdf(clone, {
        filename: `${currentInvoice.invoiceNumber || 'invoice'}.pdf`,
      })
    } finally {
      document.body.removeChild(clone)
    }
  }, [currentInvoice.invoiceNumber])

  return (
    <div className="mx-auto max-w-4xl">
      <MacWindow title={`Fatura Flow — ${currentInvoice.invoiceNumber || 'New Invoice'}`}>
        <div className="space-y-5">

          {/* ── Invoice Details ── */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={currentInvoice.status}
                  onValueChange={(val) => val && handleFieldUpdate('status', val as Invoice['status'])}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currentInvoice.currency}
                  onValueChange={(val) => val && handleFieldUpdate('currency', val as Invoice['currency'])}
                >
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={currentInvoice.dueDate.split('T')[0] ?? ''}
                  onChange={(e) => handleFieldUpdate('dueDate', new Date(e.target.value).toISOString())}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Sender / Client ── */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>From (You)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: 'sender-name',    label: 'Name',    field: 'name'    as const, type: 'text'  },
                  { id: 'sender-email',   label: 'Email',   field: 'email'   as const, type: 'email' },
                  { id: 'sender-phone',   label: 'Phone',   field: 'phone'   as const, type: 'text'  },
                  { id: 'sender-taxId',   label: 'Tax ID',  field: 'taxId'   as const, type: 'text'  },
                ].map(({ id, label, field, type }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      type={type}
                      value={(currentInvoice.sender[field] as string | undefined) ?? ''}
                      onChange={(e) => handleSenderUpdate(field, e.target.value)}
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <Label htmlFor="sender-address">Address</Label>
                  <Textarea
                    id="sender-address"
                    value={currentInvoice.sender.address ?? ''}
                    onChange={(e) => handleSenderUpdate('address', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Bill To</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: 'client-name',   label: 'Name',   field: 'name'  as const, type: 'text'  },
                  { id: 'client-email',  label: 'Email',  field: 'email' as const, type: 'email' },
                  { id: 'client-phone',  label: 'Phone',  field: 'phone' as const, type: 'text'  },
                  { id: 'client-taxId',  label: 'Tax ID', field: 'taxId' as const, type: 'text'  },
                ].map(({ id, label, field, type }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      type={type}
                      value={(currentInvoice.client[field] as string | undefined) ?? ''}
                      onChange={(e) => handleClientUpdate(field, e.target.value)}
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <Label htmlFor="client-address">Address</Label>
                  <Textarea
                    id="client-address"
                    value={currentInvoice.client.address ?? ''}
                    onChange={(e) => handleClientUpdate('address', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Line Items ── */}
          <Card>
            <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_72px_96px_88px_36px] gap-2 px-1">
                {['Description', 'Qty', 'Unit Price', 'Total', ''].map((h) => (
                  <span key={h} className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{h}</span>
                ))}
              </div>
              {currentInvoice.lineItems.map((item, index) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  onUpdate={handleLineItemUpdate}
                  onRemove={removeLineItem}
                />
              ))}
              <Button variant="outline" size="sm" onClick={addLineItem} className="mt-1">
                + Add Item
              </Button>
            </CardContent>
          </Card>

          {/* ── Totals ── */}
          <div className="flex justify-end">
            <div className="w-64 rounded-[20px] border border-white/[0.08] bg-white/[0.025] p-4 space-y-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <div className="flex justify-between text-sm">
                <span className="text-white/45">Subtotal</span>
                <span className="text-white/75 font-medium">{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center gap-2 text-sm">
                <span className="text-white/45">Tax</span>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    className="w-16 h-7 text-xs text-right rounded-[12px]"
                    value={currentInvoice.taxRate}
                    onChange={(e) => handleFieldUpdate('taxRate', Number(e.target.value))}
                  />
                  <span className="text-white/45">%</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/45">Tax Amount</span>
                <span className="text-white/75 font-medium">{totals.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-white/[0.08]">
                <span className="text-white/75">Total</span>
                <span className="text-white/95">
                  {currentInvoice.currency} {totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                placeholder="Payment terms, additional notes…"
                value={currentInvoice.notes ?? ''}
                onChange={(e) => handleFieldUpdate('notes', e.target.value)}
              />
            </CardContent>
          </Card>

          {/* ── Actions ── */}
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button variant="outline" onClick={() => setShowPdfPreview(true)}>PDF Preview</Button>
            <Button onClick={handleSave}>Save Invoice</Button>
          </div>
        </div>
      </MacWindow>

      {/* PDF Preview Dialog */}
      <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
        <DialogContent className="max-w-5xl w-[90vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>Preview your invoice before downloading.</DialogDescription>
          </DialogHeader>
          <div ref={pdfPreviewRef}>
            <InvoicePreview invoice={currentInvoice} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPdfPreview(false)}>Close</Button>
            <Button onClick={handleDownloadPdf}>Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
