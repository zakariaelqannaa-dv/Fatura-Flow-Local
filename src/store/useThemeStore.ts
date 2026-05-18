import { create } from 'zustand'

export type Theme = 'dark' | 'light' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
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

const initialTheme = getInitialTheme()
applyTheme(initialTheme)

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const current = localStorage.getItem('fatura-flow-theme')
  if (!current || current === 'system') applyTheme('system')
})

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    applyTheme(theme)
    try { localStorage.setItem('fatura-flow-theme', theme) } catch {}
    set({ theme })
  },
}))
