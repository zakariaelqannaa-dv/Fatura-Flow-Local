export const STORAGE_KEYS = {
  INVOICES: 'fatura-flow-invoices',
  COUNTER: 'fatura-flow-counter',
} as const

export const INVOICE_PREFIX = 'FAT'
export const DEFAULT_CURRENCY = 'TRY'

export const STATUS_OPTIONS = ['draft', 'sent', 'paid', 'cancelled'] as const
export const CURRENCY_OPTIONS = ['TRY', 'USD', 'EUR', 'GBP'] as const
