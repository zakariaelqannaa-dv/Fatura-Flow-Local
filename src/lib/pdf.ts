import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export interface PdfOptions {
  filename?: string
  margin?: number
}

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

export async function generateInvoicePdf(
  element: HTMLElement,
  options: PdfOptions = {},
): Promise<void> {
  const { filename = 'invoice.pdf', margin = 8 } = options

  // Size element to A4 content dimensions (minus margins)
  const a4ContentPx = Math.round(((210 - margin * 2) / 25.4) * 96)
  const a4HeightPx = Math.round(((297 - margin * 2) / 25.4) * 96)

  element.style.setProperty('width', `${a4ContentPx}px`, 'important')
  element.style.setProperty('height', `${a4HeightPx}px`, 'important')
  element.style.setProperty('box-sizing', 'border-box', 'important')

  injectSafeStylesheet(element)

  // Wait for web fonts (Geist) to finish loading before capture
  await document.fonts.ready

  const canvas = await html2canvas(element, {
    scale: 2,
    allowTaint: false,
    logging: false,
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.98)

  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  })

  const imgWidth = 210 - margin * 2
  const imgHeight = (canvas.height / canvas.width) * imgWidth

  pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight)
  pdf.save(filename)
}
