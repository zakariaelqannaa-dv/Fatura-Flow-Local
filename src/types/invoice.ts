export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'cancelled'
export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP'

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface SenderInfo {
  name: string
  email?: string
  phone?: string
  address?: string
  taxId?: string
}

export interface Client {
  name: string
  email?: string
  phone?: string
  address?: string
  taxId?: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  createdAt: string
  updatedAt: string
  dueDate: string
  sender: SenderInfo
  client: Client
  lineItems: LineItem[]
  taxRate: number
  currency: Currency
  notes?: string
}

export interface InvoiceTotals {
  subtotal: number
  taxAmount: number
  total: number
}

export function calculateTotals(lineItems: LineItem[], taxRate: number): InvoiceTotals {
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount
  return { subtotal, taxAmount, total }
}

export function createEmptyInvoice(): Invoice {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    invoiceNumber: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    dueDate: now,
    sender: { name: '' },
    client: { name: '' },
    lineItems: [{ id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 }],
    taxRate: 0,
    currency: 'TRY',
  }
}
