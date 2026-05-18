import type { Invoice } from '../types/invoice'
import { STORAGE_KEYS, INVOICE_PREFIX } from '../constants'

function readInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Invoice[]
  } catch {
    return []
  }
}

function writeInvoices(invoices: Invoice[]): void {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices))
}

export function getInvoices(): Invoice[] {
  return readInvoices()
}

export function getInvoice(id: string): Invoice | undefined {
  return readInvoices().find((inv) => inv.id === id)
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = readInvoices()
  const index = invoices.findIndex((inv) => inv.id === invoice.id)
  const updated = { ...invoice, updatedAt: new Date().toISOString() }

  if (index >= 0) {
    invoices[index] = updated
  } else {
    invoices.push(updated)
  }

  writeInvoices(invoices)
}

export function deleteInvoice(id: string): void {
  const invoices = readInvoices().filter((inv) => inv.id !== id)
  writeInvoices(invoices)
}

export function getNextInvoiceNumber(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUNTER)
    const current = raw ? Number(raw) : 0
    const next = current + 1
    localStorage.setItem(STORAGE_KEYS.COUNTER, String(next))
    const year = new Date().getFullYear()
    return `${INVOICE_PREFIX}-${year}-${String(next).padStart(4, '0')}`
  } catch {
    return `${INVOICE_PREFIX}-${new Date().getFullYear()}-0001`
  }
}

export function exportData(): string {
  const payload: Record<string, string | null> = {}
  for (const key of Object.values(STORAGE_KEYS)) {
    payload[key] = localStorage.getItem(key)
  }
  return JSON.stringify(payload, null, 2)
}

export interface ImportResult {
  success: boolean
  count: number
  error?: string
}

export function importData(json: string): ImportResult {
  try {
    const parsed = JSON.parse(json)

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, count: 0, error: 'Invalid backup format: expected a JSON object' }
    }

    const invoicesRaw = parsed[STORAGE_KEYS.INVOICES]
    if (!invoicesRaw) {
      return { success: false, count: 0, error: 'Backup is missing invoice data' }
    }

    let invoices: unknown[]
    if (typeof invoicesRaw === 'string') {
      invoices = JSON.parse(invoicesRaw)
    } else if (Array.isArray(invoicesRaw)) {
      invoices = invoicesRaw
    } else {
      return { success: false, count: 0, error: 'Invoice data must be an array or JSON string' }
    }

    if (!Array.isArray(invoices)) {
      return { success: false, count: 0, error: 'Invoice data must be an array' }
    }

    for (const key of Object.values(STORAGE_KEYS)) {
      const val = parsed[key]
      if (val !== undefined && val !== null) {
        localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val))
      }
    }

    return { success: true, count: invoices.length }
  } catch (err) {
    return {
      success: false,
      count: 0,
      error: err instanceof Error ? err.message : 'Unknown error during import',
    }
  }
}
