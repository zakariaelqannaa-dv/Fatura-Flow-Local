import { useCallback } from 'react'
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
    <div className="grid grid-cols-[1fr_80px_100px_100px_36px] gap-2 items-end">
      <div>
        <Label htmlFor={`desc-${item.id}`} className="sr-only">
          Description
        </Label>
        <Input
          id={`desc-${item.id}`}
          placeholder="Description"
          value={item.description}
          onChange={(e) => onUpdate(index, 'description', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`qty-${item.id}`} className="sr-only">
          Quantity
        </Label>
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
        <Label htmlFor={`price-${item.id}`} className="sr-only">
          Unit Price
        </Label>
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
      <div className="flex items-center h-8 text-sm text-muted-foreground pt-1">
        {rowTotal.toFixed(2)}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onRemove(index)}
        aria-label="Remove line item"
      >
        ✕
      </Button>
    </div>
  )
}

export function InvoiceForm() {
  const currentInvoice = useInvoiceStore((s) => s.currentInvoice)
  const updateCurrentInvoice = useInvoiceStore((s) => s.updateCurrentInvoice)
  const saveCurrentInvoice = useInvoiceStore((s) => s.saveCurrentInvoice)
  const createNewInvoice = useInvoiceStore((s) => s.createNewInvoice)
  const setCurrentInvoice = useInvoiceStore((s) => s.setCurrentInvoice)

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
      updateCurrentInvoice({
        sender: { ...currentInvoice.sender, [field]: value },
      })
    },
    [updateCurrentInvoice, currentInvoice.sender],
  )

  const handleClientUpdate = useCallback(
    <K extends keyof Invoice['client']>(field: K, value: string) => {
      updateCurrentInvoice({
        client: { ...currentInvoice.client, [field]: value },
      })
    },
    [updateCurrentInvoice, currentInvoice.client],
  )

  const handleLineItemUpdate = useCallback(
    (index: number, field: keyof LineItem, value: string | number) => {
      const items = currentInvoice.lineItems.map((item, i) => {
        if (i !== index) return item
        if (field === 'quantity' || field === 'unitPrice') {
          return { ...item, [field]: value as number }
        }
        return { ...item, [field]: value as string }
      })
      updateCurrentInvoice({ lineItems: items })
    },
    [updateCurrentInvoice, currentInvoice.lineItems],
  )

  const addLineItem = useCallback(() => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
    }
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

  const handleCancel = useCallback(() => {
    setCurrentInvoice(null)
  }, [setCurrentInvoice])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {currentInvoice.invoiceNumber || 'New Invoice'}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={currentInvoice.status}
              onValueChange={(val) =>
                val && handleFieldUpdate('status', val as Invoice['status'])
              }
            >
              <SelectTrigger>
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
          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={currentInvoice.currency}
              onValueChange={(val) =>
                val && handleFieldUpdate('currency', val as Invoice['currency'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={currentInvoice.dueDate.split('T')[0] ?? ''}
              onChange={(e) =>
                handleFieldUpdate('dueDate', new Date(e.target.value).toISOString())
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>From (You)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="sender-name">Name *</Label>
              <Input
                id="sender-name"
                value={currentInvoice.sender.name}
                onChange={(e) => handleSenderUpdate('name', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sender-email">Email</Label>
              <Input
                id="sender-email"
                type="email"
                value={currentInvoice.sender.email ?? ''}
                onChange={(e) => handleSenderUpdate('email', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sender-phone">Phone</Label>
              <Input
                id="sender-phone"
                value={currentInvoice.sender.phone ?? ''}
                onChange={(e) => handleSenderUpdate('phone', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sender-address">Address</Label>
              <Textarea
                id="sender-address"
                value={currentInvoice.sender.address ?? ''}
                onChange={(e) => handleSenderUpdate('address', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sender-taxId">Tax ID</Label>
              <Input
                id="sender-taxId"
                value={currentInvoice.sender.taxId ?? ''}
                onChange={(e) => handleSenderUpdate('taxId', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="client-name">Name *</Label>
              <Input
                id="client-name"
                value={currentInvoice.client.name}
                onChange={(e) => handleClientUpdate('name', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-email">Email</Label>
              <Input
                id="client-email"
                type="email"
                value={currentInvoice.client.email ?? ''}
                onChange={(e) => handleClientUpdate('email', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-phone">Phone</Label>
              <Input
                id="client-phone"
                value={currentInvoice.client.phone ?? ''}
                onChange={(e) => handleClientUpdate('phone', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-address">Address</Label>
              <Textarea
                id="client-address"
                value={currentInvoice.client.address ?? ''}
                onChange={(e) => handleClientUpdate('address', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-taxId">Tax ID</Label>
              <Input
                id="client-taxId"
                value={currentInvoice.client.taxId ?? ''}
                onChange={(e) => handleClientUpdate('taxId', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-[1fr_80px_100px_100px_36px] gap-2 text-xs font-medium text-muted-foreground px-1">
            <span>Description</span>
            <span>Qty</span>
            <span>Price</span>
            <span>Total</span>
            <span />
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
          <Button variant="outline" size="sm" onClick={addLineItem}>
            + Add Item
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground">Tax</span>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={0}
                max={100}
                step={0.1}
                className="w-16 h-6 text-xs text-right"
                value={currentInvoice.taxRate}
                onChange={(e) =>
                  handleFieldUpdate('taxRate', Number(e.target.value))
                }
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax Amount</span>
            <span>{totals.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-1 border-t">
            <span>Total</span>
            <span>
              {currentInvoice.currency} {totals.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Payment terms, additional notes..."
            value={currentInvoice.notes ?? ''}
            onChange={(e) => handleFieldUpdate('notes', e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Invoice</Button>
      </div>
    </div>
  )
}
