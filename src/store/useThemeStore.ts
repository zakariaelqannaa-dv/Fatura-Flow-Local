import { create } from 'zustand'
import type { Currency } from '@/types/invoice'
import { DEFAULT_CURRENCY, CURRENCY_OPTIONS } from '@/constants'

export type Theme = 'dark' | 'light' | 'system'

interface ThemeStore {
  theme: Theme
  displayCurrency: Currency
  setTheme: (theme: Theme) => void
  setDisplayCurrency: (currency: Currency) => void
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  let resolvedTheme = theme
  if (theme === 'system') {
    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  
  if (resolvedTheme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
  }
}

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('fatura-flow-theme') as Theme | null
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  } catch {}
  return 'system'
}

function getInitialCurrency(): Currency {
  try {
    const stored = localStorage.getItem('fatura-flow-currency') as Currency | null
    if (CURRENCY_OPTIONS.includes(stored as any)) return stored as Currency
  } catch {}
  return DEFAULT_CURRENCY
}

const initialTheme = getInitialTheme()
applyTheme(initialTheme)

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const current = localStorage.getItem('fatura-flow-theme')
  if (!current || current === 'system') applyTheme('system')
})

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: initialTheme,
  displayCurrency: getInitialCurrency(),
  setTheme: (theme) => {
    applyTheme(theme)
    try { localStorage.setItem('fatura-flow-theme', theme) } catch {}
    set({ theme })
  },
  setDisplayCurrency: (currency) => {
    try { localStorage.setItem('fatura-flow-currency', currency) } catch {}
    set({ displayCurrency: currency })
  },
}))
