import html2pdf from 'html2pdf.js'

export interface PdfOptions {
  filename?: string
  margin?: number
}

/**
 * Pattern matching all CSS color functions that html2canvas cannot parse.
 * These include:
 *   - oklab(), oklch(), lab(), lch(), color()
 *   - color-mix(in oklab, ...) and color-mix(in oklch, ...)
 */
const UNSAFE_COLOR_RE =
  /\b(oklab|oklch|color\(|lab\(|lch\()|color-mix\s*\(\s*in\s+(oklab|oklch)\s*,/i

const COLOR_PROPERTIES = [
  'color',
  'background-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'column-rule-color',
] as const

/**
 * Inject a <style> reset into the element that overrides Tailwind's global
 * `* { @apply border-white/10 outline-white/20 }` rule (which produces
 * `color-mix(in oklab, ...)` values).  Inline styles from InvoicePreview
 * take precedence because they have higher specificity than `*`.
 */
function injectSafeStylesheet(root: HTMLElement): void {
  const style = document.createElement('style')
  style.textContent = [
    '* {',
    '  color: #111827;',
    '  background-color: transparent;',
    '  border-top-color: #e5e7eb;',
    '  border-right-color: #e5e7eb;',
    '  border-bottom-color: #e5e7eb;',
    '  border-left-color: #e5e7eb;',
    '  outline-color: transparent;',
    '  text-decoration-color: #111827;',
    '  column-rule-color: #e5e7eb;',
    '}',
  ].join('\n')
  root.insertBefore(style, root.firstChild)
}

/**
 * Walk every descendant and force-inline any colour value that the regex
 * flags.  This catches cases where the browser computed-style still exposes
 * an unresolved value (e.g. in older browser versions).
 */
function sanitizeComputedStyles(root: HTMLElement): void {
  function check(el: HTMLElement) {
    const cs = getComputedStyle(el)
    for (const prop of COLOR_PROPERTIES) {
      const val = cs.getPropertyValue(prop)
      if (UNSAFE_COLOR_RE.test(val)) {
        el.style.setProperty(prop, '#111827', 'important')
      }
    }
    if (el.shadowRoot) {
      el.shadowRoot.querySelectorAll('*').forEach((child) => {
        check(child as HTMLElement)
      })
    }
    for (let i = 0; i < el.children.length; i++) {
      check(el.children[i] as HTMLElement)
    }
  }
  check(root)
}

export async function generateInvoicePdf(
  element: HTMLElement,
  options: PdfOptions = {},
): Promise<void> {
  const { filename = 'invoice.pdf', margin = 8 } = options

  // ── Size the element to match A4 content area ──────────────
  // A4 = 210 × 297 mm.  At 96 CSS px/in that gives us:
  //   content width (pixels) = (210 - 2*margin) / 25.4 * 96
  const a4ContentPx = Math.round(((210 - margin * 2) / 25.4) * 96)

  element.style.setProperty('width', `${a4ContentPx}px`, 'important')
  element.style.setProperty('max-width', `${a4ContentPx}px`, 'important')
  element.style.setProperty('box-sizing', 'border-box', 'important')
  element.style.setProperty('overflow', 'hidden', 'important')

  // ── Inject safe CSS cascade reset ───────────────────────────
  // Neutralises Tailwind's `* { border-color: color-mix(in oklab, …) }`
  // without touching InvoicePreview's explicit inline styles.
  injectSafeStylesheet(element)

  // ── Sanitise computed styles (belt-and-suspenders) ──────────
  sanitizeComputedStyles(element)

  // ── Generate PDF ──────────────────────────────────────────
  await html2pdf()
    .set({
      margin,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    })
    .from(element)
    .save()
}
