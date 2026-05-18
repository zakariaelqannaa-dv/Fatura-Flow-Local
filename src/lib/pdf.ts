import html2pdf from 'html2pdf.js'

export interface PdfOptions {
  filename?: string
  margin?: number
}

/**
 * Walk all descendants and force-inline any CSS color value that html2canvas
 * cannot parse (oklab, oklch, color-mix with oklab/oklch, color(), etc.)
 * so the snapshot renders safely.
 */
function sanitizeForPdf(root: HTMLElement): void {
  const UNSAFE_COLOR_PATTERN =
    /\b(oklab|oklch|color\(|lab\(|lch\()|color-mix\s*\(\s*in\s+(oklab|oklch)\s*,/i

  const FALLBACKS: Record<string, string> = {
    'color': '#111827',
    'background-color': 'transparent',
    'border-top-color': '#e5e7eb',
    'border-right-color': '#e5e7eb',
    'border-bottom-color': '#e5e7eb',
    'border-left-color': '#e5e7eb',
    'outline-color': 'transparent',
    'text-decoration-color': '#111827',
    'column-rule-color': '#e5e7eb',
  }

  function check(el: HTMLElement) {
    const props = Object.keys(FALLBACKS) as Array<keyof typeof FALLBACKS>

    // 1. Check inline styles first (fast path for elements with explicit styles)
    for (const prop of props) {
      const inlineVal = el.style.getPropertyValue(prop)
      const fallback = FALLBACKS[prop]!
      if (inlineVal && UNSAFE_COLOR_PATTERN.test(inlineVal)) {
        el.style.setProperty(prop, fallback, 'important')
      }
    }

    // 2. Check computed styles (catches inherited values from Tailwind's
    //    `@supports (color: color-mix(in lab, red, red))` blocks)
    const cs = getComputedStyle(el)
    for (const prop of props) {
      const val = cs.getPropertyValue(prop)
      const fallback = FALLBACKS[prop]!
      if (UNSAFE_COLOR_PATTERN.test(val)) {
        el.style.setProperty(prop, fallback, 'important')
      }
    }

    // Walk shadow roots & children
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

  // ── Strip any unsupported colour functions ────────────────
  sanitizeForPdf(element)

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
