import { create } from 'zustand'
import type { Invoice } from '@/types/invoice'
import { createEmptyInvoice } from '@/types/invoice'
import {
  getInvoices,
  getInvoice,
  saveInvoice,
  deleteInvoice,
  getNextInvoiceNumber,
  exportData,
  importData,
  type ImportResult,
} from '@/lib/storage'

interface InvoiceStore {
  invoices: Invoice[]
  currentInvoice: Invoice | null
  isFormDirty: boolean

  loadInvoices: () => void
  loadInvoice: (id: string) => void
  createNewInvoice: () => void
  updateCurrentInvoice: (partial: Partial<Invoice>) => void
  saveCurrentInvoice: () => void
  deleteInvoice: (id: string) => void
  setCurrentInvoice: (invoice: Invoice | null) => void
  setFormDirty: (dirty: boolean) => void

  exportData: () => string
  importData: (json: string) => ImportResult
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  currentInvoice: null,
  isFormDirty: false,

  loadInvoices: () => {
    set({ invoices: getInvoices() })
  },

  loadInvoice: (id: string) => {
    const invoice = getInvoice(id) ?? null
    set({ currentInvoice: invoice, isFormDirty: false })
  },

  createNewInvoice: () => {
    const invoice = createEmptyInvoice()
    invoice.invoiceNumber = getNextInvoiceNumber()
    set({ currentInvoice: invoice, isFormDirty: false })
  },

  updateCurrentInvoice: (partial: Partial<Invoice>) => {
    const current = get().currentInvoice
    if (!current) return
    const updated = { ...current, ...partial, updatedAt: new Date().toISOString() }
    set({ currentInvoice: updated, isFormDirty: true })
  },

  saveCurrentInvoice: () => {
    const { currentInvoice } = get()
    if (!currentInvoice) return
    saveInvoice(currentInvoice)
    set({
      invoices: getInvoices(),
      isFormDirty: false,
    })
  },

  deleteInvoice: (id: string) => {
    deleteInvoice(id)
    set({
      invoices: getInvoices(),
      currentInvoice: get().currentInvoice?.id === id ? null : get().currentInvoice,
    })
  },

  setCurrentInvoice: (invoice: Invoice | null) => {
    set({ currentInvoice: invoice, isFormDirty: false })
  },

  setFormDirty: (dirty: boolean) => {
    set({ isFormDirty: dirty })
  },

  exportData: () => exportData(),

  importData: (json: string) => {
    const result = importData(json)
    if (result.success) {
      set({ invoices: getInvoices() })
    }
    return result
  },
}))
