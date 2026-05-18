import html2pdf from 'html2pdf.js'

export interface PdfOptions {
  filename?: string
  margin?: number
}

/**
 * Walk all descendants and force-inline any CSS color value that html2canvas
 * cannot parse (oklab, oklch, color(), etc.) so the snapshot renders safely.
 */
function sanitizeForPdf(root: HTMLElement): void {
  const UNSAFE_COLOR_PATTERN =
    /\b(oklab|oklch|color\(|lab\(|lch\()/i

  function check(el: HTMLElement) {
    const cs = getComputedStyle(el)

    // Properties that hold color values.
    const colorProps = [
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

    for (const prop of colorProps) {
      const val = cs.getPropertyValue(prop)
      if (UNSAFE_COLOR_PATTERN.test(val)) {
        // Override with a safe fallback visible on white backgrounds.
        el.style.setProperty(prop, '#000000', 'important')
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
